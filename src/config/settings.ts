import * as vscode from 'vscode';

export interface ButterflyGraphSettings {
    callerLevels: number;
    calleeLevels: number;
    maxNodesPerLevel: number;
    theme: string;
}

export class SettingsManager {
    private static instance: SettingsManager;
    private settings: ButterflyGraphSettings;
    private disposables: vscode.Disposable[] = [];

    private constructor() {
        this.settings = this.loadSettings();
        this.setupConfigurationListener();
    }

    public static getInstance(): SettingsManager {
        if (!SettingsManager.instance) {
            SettingsManager.instance = new SettingsManager();
        }
        return SettingsManager.instance;
    }

    private loadSettings(): ButterflyGraphSettings {
        const config = vscode.workspace.getConfiguration('butterflyGraph');
        return {
            callerLevels: config.get<number>('callerLevels') || 2,
            calleeLevels: config.get<number>('calleeLevels') || 2,
            maxNodesPerLevel: config.get<number>('maxNodesPerLevel') || 10,
            theme: config.get<string>('theme') || 'default'
        };
    }

    private setupConfigurationListener(): void {
        const disposable = vscode.workspace.onDidChangeConfiguration(e => {
            if (e.affectsConfiguration('butterflyGraph')) {
                this.settings = this.loadSettings();
            }
        });
        this.disposables.push(disposable);
    }

    public getSettings(): ButterflyGraphSettings {
        return { ...this.settings };
    }

    public dispose(): void {
        this.disposables.forEach(d => d.dispose());
    }
} 