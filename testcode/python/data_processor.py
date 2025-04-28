from typing import List, Dict, Optional
import pandas as pd
import numpy as np
from datetime import datetime

class DataProcessor:
    def __init__(self):
        self.data: Optional[pd.DataFrame] = None
        self.processed_data: Dict[str, pd.DataFrame] = {}
        
    def load_data(self, file_path: str) -> bool:
        """データファイルを読み込む"""
        try:
            self.data = pd.read_csv(file_path)
            return True
        except Exception as e:
            print(f"Error loading data: {e}")
            return False
            
    def clean_data(self) -> pd.DataFrame:
        """データのクリーニングを行う"""
        if self.data is None:
            raise ValueError("No data loaded")
            
        cleaned = self.data.copy()
        cleaned = self._remove_duplicates(cleaned)
        cleaned = self._handle_missing_values(cleaned)
        cleaned = self._normalize_columns(cleaned)
        
        self.processed_data['cleaned'] = cleaned
        return cleaned
        
    def _remove_duplicates(self, df: pd.DataFrame) -> pd.DataFrame:
        """重複行を削除"""
        return df.drop_duplicates()
        
    def _handle_missing_values(self, df: pd.DataFrame) -> pd.DataFrame:
        """欠損値の処理"""
        numeric_columns = df.select_dtypes(include=[np.number]).columns
        df[numeric_columns] = df[numeric_columns].fillna(df[numeric_columns].mean())
        
        categorical_columns = df.select_dtypes(include=['object']).columns
        df[categorical_columns] = df[categorical_columns].fillna('unknown')
        
        return df
        
    def _normalize_columns(self, df: pd.DataFrame) -> pd.DataFrame:
        """数値列の正規化"""
        numeric_columns = df.select_dtypes(include=[np.number]).columns
        for col in numeric_columns:
            df[f"{col}_normalized"] = (df[col] - df[col].min()) / (df[col].max() - df[col].min())
        return df
        
    def calculate_statistics(self, column: str) -> Dict[str, float]:
        """指定された列の統計情報を計算"""
        if self.data is None:
            raise ValueError("No data loaded")
            
        if column not in self.data.columns:
            raise ValueError(f"Column {column} not found in data")
            
        stats = {
            'mean': self._calculate_mean(column),
            'median': self._calculate_median(column),
            'std': self._calculate_std(column),
            'skewness': self._calculate_skewness(column)
        }
        
        return stats
        
    def _calculate_mean(self, column: str) -> float:
        """平均値を計算"""
        return float(self.data[column].mean())
        
    def _calculate_median(self, column: str) -> float:
        """中央値を計算"""
        return float(self.data[column].median())
        
    def _calculate_std(self, column: str) -> float:
        """標準偏差を計算"""
        return float(self.data[column].std())
        
    def _calculate_skewness(self, column: str) -> float:
        """歪度を計算"""
        return float(self.data[column].skew())
        
    def generate_report(self, output_file: str) -> None:
        """分析レポートを生成"""
        if self.data is None:
            raise ValueError("No data loaded")
            
        report = []
        report.append(f"Data Analysis Report - {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
        report.append("\nDataset Overview:")
        report.append(f"Total Records: {len(self.data)}")
        report.append(f"Total Features: {len(self.data.columns)}")
        
        for column in self.data.select_dtypes(include=[np.number]).columns:
            stats = self.calculate_statistics(column)
            report.append(f"\nStatistics for {column}:")
            for stat_name, value in stats.items():
                report.append(f"{stat_name}: {value:.2f}")
                
        with open(output_file, 'w') as f:
            f.write('\n'.join(report)) 