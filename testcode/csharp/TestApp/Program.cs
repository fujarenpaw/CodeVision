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

    public class StringProcessor
    {
        public string Capitalize(string input)
        {
            if (string.IsNullOrEmpty(input))
                return input;
            return input.ToUpper();
        }

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