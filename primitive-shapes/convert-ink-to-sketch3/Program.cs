using System;
using System.Collections.Generic;
using System.Drawing;
using System.IO;
using System.Linq;
using System.Text.Json;
using System.Text.Json.Serialization;

namespace convert_ink_to_sketch3
{

    public class InkRequest
    {
        public string language { get; set; }
        public int max_completions { get; set; }
        public int max_num_results { get; set; }
        public string pre_context { get; set; }
        // "writing_guide": {
        //     "width": 1000,
        //     "height": 1000
        // },
        public decimal[][][] ink { get; set; }
    }

    public class InkFormat
    {
        public string api_level{ get; set; }
        public decimal app_version{ get; set; }
        public decimal input_type { get; set; }
        public string device{ get; set; }
        public string itc{ get; set; }
        public string options{ get; set; }
        public InkRequest[] requests{ get; set; }

    }

    class Program
    {
        static void Main(string[] args)
        {
            var inputFileName = args.First();
            var outputFileName = (args.Length > 1) ? args[1] : Path.ChangeExtension(inputFileName, ".sk3");

            var json = File.ReadAllText(inputFileName);
            var deserialized = JsonSerializer.Deserialize<InkFormat>(json);

            var ink = deserialized.requests.Single().ink;
            
            var result = new List<int[]>();
            
            (int x, int y)? recentlyAdded = null;

            foreach (var stroke in ink)
            {
                var x = stroke[0];
                var y = stroke[1];
                var t = stroke[2];

                for (var i = 0; i < x.Length; i++)
                {
                    // Each point in the data sequences consisted of three numbers: the x and y offset from the previous point,
                    // and the binary end-of - stroke feature. input layer was therefore size 3.
                    // forth integer is label, denoting the segment of the sketch. We dont have this in drawing, its a subject for prediction
                    (int x, int y) point = ((int)Math.Round(x[i]), (int)Math.Round(y[i]));
                    if (recentlyAdded == null)
                        recentlyAdded = point;
                    else if (point != recentlyAdded)
                    {
                        result.Add(new[]
                        {
                            point.x - recentlyAdded!.Value.x,
                            point.y - recentlyAdded!.Value.y,
                            i == x.Length - 1 ? 1 : 0
                        });
                        recentlyAdded = point;
                    }


                }
            }

            var serialized = JsonSerializer.Serialize(result);
            File.WriteAllText(outputFileName, serialized);
        }


    }
}
