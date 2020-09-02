using System;
using System.Collections;
using System.Collections.Generic;
using System.Drawing;
using System.Drawing.Drawing2D;
using System.Drawing.Imaging;
using System.IO;
using System.Linq;
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
            Console.WriteLine("Generating arrows");
            for (var i = 0; i < 100; i++)
                DrawArrows(i, DataDestination.Training);

            // Console.WriteLine("Ellipses...");
            // var nEllipses = 100;
            // for (var i = 0; i < nEllipses; i++)
            //     DrawEllipse(i, DataDestination.Training);
            //
            // Console.WriteLine("Rectangles...");
            // var nRectangles = 100;
            // for (var i = 0; i < nRectangles; i++)
            //     DrawRectangle(i, DataDestination.Training);
            //
            // Console.WriteLine("Rounded Rectangles...");
            // var nRoundedRectangles = 100;
            // for (var i = 0; i < nRoundedRectangles; i++)
            //     DrawRoundedRectangle(i, DataDestination.Training);
            //
            //
            // Console.WriteLine("Ellipses...");
            // for (var i = 0; i < nEllipses / 5; i++)
            //     DrawEllipse(i, DataDestination.Validation);
            //
            // Console.WriteLine("Rectangles...");
            // for (var i = 0; i < nRectangles / 5; i++)
            //     DrawRectangle(i, DataDestination.Validation);
            //
            // Console.WriteLine("Rounded Rectangles...");
            // for (var i = 0; i < nRoundedRectangles / 5; i++)
            //     DrawRoundedRectangle(i, DataDestination.Validation);

        }

        private static void DrawEllipse(int index, DataDestination destination)
        {
            var width = _random.Next(ImageWidth / 2, ImageWidth);
            var height = _random.Next(ImageHeight / 2, ImageHeight);

            var bounds = new Rectangle((ImageWidth - width) / 2, (ImageHeight - height) / 2, width, height);
            CreatePicture(graphics => graphics.DrawEllipse(_pen, bounds), "ellipse", index, destination);
        }


        private static double BezierCurve(Point p0, Point p1, Point p2, ICollection<Point> path)
        {
            PointF PointAtT(float t)
            {
                return new PointF
                {
                    X = (1 - t) * (1 - t) * p0.X + (2 * t * (1 - t) * p1.X) + (t * t * p2.X),
                    Y = (1 - t) * (1 - t) * p0.Y + (2 * t * (1 - t) * p1.Y) + (t * t * p2.Y)
                };
            };

            Point? recentlyAdded = null;
            
            for (float t = 0f; t <= 1.0; t += 0.01f)
            {
                PointF pt = PointAtT(t);
                Point intPoint = new Point((int) Math.Round(pt.X), (int) Math.Round(pt.Y));
                if (intPoint != recentlyAdded)
                {
                    path.Add(intPoint);
                    recentlyAdded = intPoint;
                }
            }
            return Angle(PointAtT(0.99f), PointAtT(1.0f));
        }

        private static double Angle(PointF pf1, PointF pf2)
        {
            float xDiff = pf2.X - pf1.X;
            float yDiff = pf2.Y - pf1.Y;
            return Math.Atan2(yDiff, xDiff);
        }

        private static void DrawArrows(int index, DataDestination destination)
        {
            const int arrowWidth = ImageWidth - 20;
            const int arrowHeight = ImageHeight - 20;
            var startPoint = new Point(0, 0);
            var endPoint = new Point(arrowWidth, arrowHeight);

            ICollection<Point> points = new List<Point>();

            var middleX = _random.Next(arrowWidth/10, arrowWidth * 8/10);
            var middleY = _random.Next(arrowWidth / 10, arrowWidth * 8 / 10); //_random.Next(middleX, arrowHeight * 8/10);

            var middlePoint = new Point(middleX, middleY);
            //middlePoint = new Point(arrowWidth * 9/10, arrowHeight);
            var angle = DrawArrowsTrunk(startPoint, middlePoint, endPoint, points);
            var leftTickLen = _random.Next(arrowWidth * 15 / 100, arrowWidth * 50 / 100);
            var rightTickLen = leftTickLen * _random.Next(90, 110)/ 100;
            var tickToTrunkAngle = Math.PI / 360.0 * _random.Next( 15, 30);

            CreatePicture(g =>
            {
                g.DrawLines(_pen, points.ToArray());
                var leftTickEnd = endPoint;
                leftTickEnd.X -= (int)Math.Round(Math.Cos(angle + tickToTrunkAngle) * leftTickLen);
                leftTickEnd.Y -= (int)Math.Round(Math.Sin(angle + tickToTrunkAngle) * leftTickLen);
                var rightTickEnd = endPoint;
                rightTickEnd.X -= (int)Math.Round(Math.Cos(angle - tickToTrunkAngle) * rightTickLen);
                rightTickEnd.Y -= (int)Math.Round(Math.Sin(angle - tickToTrunkAngle) * rightTickLen);
                g.DrawLine(_pen, endPoint, leftTickEnd);
                g.DrawLine(_pen, endPoint, rightTickEnd);
            }, "arrow", index, destination);
        }

        private static double DrawArrowsTrunk(Point startPoint, Point middlePoint, Point endPoint, ICollection<Point> result)
        {
            return BezierCurve(startPoint, middlePoint, endPoint, result);
        }

        private static void DrawRectangle(int index, DataDestination destination)
        {
            var width = _random.Next(ImageWidth / 2, ImageWidth);
            var height = _random.Next(ImageHeight / 2, ImageHeight);

            var bounds = new Rectangle((ImageWidth - width) / 2, (ImageHeight - height) / 2, width, height);
            CreatePicture(graphics => graphics.DrawRectangle(_pen, bounds), "arrow", index, destination);
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
