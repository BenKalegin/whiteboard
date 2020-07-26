using System;
using System.Drawing;
using System.Drawing.Drawing2D;
using System.Drawing.Imaging;
using System.IO;
using System.Reflection;

namespace primitive_shape_generator
{
    class Program
    {
        const int ImageHeight = 150;
        const int ImageWidth = 150;
        private static Random _random;

        enum DataDestination
        {
            Training,
            Validation
        }

        static void Main()
        {
            _random = new Random(111);

            Console.WriteLine("Ellipses...");
            var nEllipses = 100;
            for (var i = 0; i < nEllipses; i++)
                DrawEllipse(i, DataDestination.Training);

            Console.WriteLine("Rectangles...");
            var nRectangles = 100;
            for (var i = 0; i < nRectangles; i++)
                DrawRectangle(i, DataDestination.Training);

            Console.WriteLine("Rounded Rectangles...");
            var nRoundedRectangles = 100;
            for (var i = 0; i < nRoundedRectangles; i++)
                DrawRoundedRectangle(i, DataDestination.Training);


            Console.WriteLine("Ellipses...");
            for (var i = 0; i < nEllipses / 5; i++)
                DrawEllipse(i, DataDestination.Validation);

            Console.WriteLine("Rectangles...");
            for (var i = 0; i < nRectangles / 5; i++)
                DrawRectangle(i, DataDestination.Validation);

            Console.WriteLine("Rounded Rectangles...");
            for (var i = 0; i < nRoundedRectangles / 5; i++)
                DrawRoundedRectangle(i, DataDestination.Validation);

        }

        private static void DrawEllipse(int index, DataDestination destination)
        {
            var width = _random.Next(ImageWidth / 2, ImageWidth);
            var height = _random.Next(ImageHeight / 2, ImageHeight);

            var bounds = new Rectangle((ImageWidth - width) / 2, (ImageHeight - height) / 2, width, height);
            CreatePicture(graphics => graphics.DrawEllipse(_pen, bounds), "ellipse", index, destination);
        }

        private static void DrawRectangle(int index, DataDestination destination)
        {
            var width = _random.Next(ImageWidth / 2, ImageWidth);
            var height = _random.Next(ImageHeight / 2, ImageHeight);

            var bounds = new Rectangle((ImageWidth - width) / 2, (ImageHeight - height) / 2, width, height);
            CreatePicture(graphics => graphics.DrawRectangle(_pen, bounds), "rectangle", index, destination);
        }
        private static void DrawRoundedRectangle(int index, DataDestination destination)
        {
            var width = _random.Next(ImageWidth / 2, ImageWidth);
            var height = _random.Next(ImageHeight / 2, ImageHeight);
            var minSide = Math.Min(width, height);
            var cornerRadius = _random.Next(2, minSide / 2);

            var bounds = new Rectangle((ImageWidth - width) / 2, (ImageHeight - height) / 2, width, height);

            var diameter = cornerRadius * 2;
            var size = new Size(diameter, diameter);
            var arc = new Rectangle(bounds.Location, size);
            var path = new GraphicsPath();

            if (cornerRadius == 0)
            {
                path.AddRectangle(bounds);
            }
            else
            {
                // top left arc  
                path.AddArc(arc, 180, 90);

                // top right arc  
                arc.X = bounds.Right - diameter;
                path.AddArc(arc, 270, 90);

                // bottom right arc  
                arc.Y = bounds.Bottom - diameter;
                path.AddArc(arc, 0, 90);

                // bottom left arc 
                arc.X = bounds.Left;
                path.AddArc(arc, 90, 90);

                path.CloseFigure();
            }

                
            CreatePicture(graphics => graphics.DrawPath(_pen, path) , @"roundrect", index, destination);
        }

        // use one 8bit channel only
        private static readonly Pen _pen = new Pen(Color.Black, 3);

        private static void CreatePicture(Action<Graphics> shapeBuilder, string folder, int index,
            DataDestination destination)
        {
            var destinationSubfolder = destination switch
            {
                DataDestination.Training => "training",
                DataDestination.Validation => "validation",
                _ => throw new ArgumentOutOfRangeException(nameof(destination), destination, null)
            };

            var path = Path.GetFullPath(
                Path.Combine(Assembly.GetExecutingAssembly().Location, $@"..\..\..\..\..\generated-data\{destinationSubfolder}"));


            using var bitmap = new Bitmap(ImageWidth, ImageHeight);
            using var graphics = Graphics.FromImage(bitmap);
            var brush = new SolidBrush(Color.White);
            graphics.FillRectangle(brush, 0, 0, ImageWidth, ImageHeight);

            graphics.SmoothingMode = SmoothingMode.AntiAlias;

            shapeBuilder(graphics);
            var finalPath = Path.Combine(path, folder);
            if (!Directory.Exists(finalPath))
                Directory.CreateDirectory(finalPath);
            //using var bitmap8Bit = bitmap.To8BppIndexed();
            //bitmap8Bit.Save($"{Path.Combine(finalPath, $"{index:D4}.png")}", ImageFormat.Png);
            bitmap.Save($"{Path.Combine(finalPath, $"{index:D4}.png")}", ImageFormat.Png);
        }
    }
}
