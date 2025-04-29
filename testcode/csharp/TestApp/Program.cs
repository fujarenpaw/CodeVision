using System;

namespace TestApp
{
    class Program
    {
        static void Main(string[] args)
        {
            var processor = new StringProcessor();
            string result = processor.ProcessText("Hello world world!");
            Console.WriteLine(result);
        }
    }

    /// <summary>
    /// 文字列処理を行うクラス
    /// </summary>
    public class StringProcessor
    {
        /// <summary>
        /// 文字列を大文字に変換します
        /// </summary>
        /// <param name="input">変換する文字列</param>
        /// <returns>大文字に変換された文字列</returns>
        public string Capitalize(string input)
        {
            if (string.IsNullOrEmpty(input))
                return input;
            return input.ToUpper();
        }

        /// <summary>
        /// テキストを処理し、各単語を大文字に変換します
        /// </summary>
        /// <param name="input">処理するテキスト</param>
        /// <returns>処理されたテキスト</returns>
        public string ProcessText(string input)
        {
            var words = input.Split(' ');
            var processedWords = new System.Collections.Generic.List<string>();
            foreach (var word in words)
            {
                processedWords.Add(Capitalize(word));
            }
            return string.Join(" ", processedWords);
        }
    }
}