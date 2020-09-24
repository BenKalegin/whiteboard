using System;
using System.Collections;
using System.Collections.Generic;
using System.Drawing;
using System.Drawing.Drawing2D;
using System.Drawing.Imaging;
using System.IO;
using System.Linq;
using System.Reflection;
using System.Text.Json;
using System.Text.Json.Serialization;

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
            for (var i = 0; i < 200; i++)
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


        private static (double angle, IList<Point> path) BezierCurve(Point p0, Point p1, Point p2)
        {
            var points = new List<Point>();
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
                //if (intPoint != recentlyAdded) commented out to make sure we have same number of points (100)
                {
                    points.Add(intPoint);
                    recentlyAdded = intPoint;
                }
            }
            return (Angle(PointAtT(0.99f), PointAtT(1.0f)), points);
        }

        private static IList<Point> Line(Point p0, Point p1)
        {
            PointF PointAtT(float t)
            {
                return new PointF
                {
                    X = p0.X + (p1.X - p0.X) * t,
                    Y = p0.Y + (p1.Y - p0.Y) * t
                };
            };

            Point? recentlyAdded = null;

            var result = new List<Point>();

            for (float t = 0f; t <= 1.0; t += 0.01f)
            {
                PointF pt = PointAtT(t);
                Point intPoint = new Point((int) Math.Round(pt.X), (int) Math.Round(pt.Y));
                if (intPoint != recentlyAdded)
                {
                    result.Add(intPoint);
                    recentlyAdded = intPoint;
                }
            }

            return result;
        }

        private static double Angle(PointF pf1, PointF pf2)
        {
            float xDiff = pf2.X - pf1.X;
            float yDiff = pf2.Y - pf1.Y;
            return Math.Atan2(yDiff, xDiff);
        }

        // ➤ acute
        // ➧ squat
        // ➨ concave
        // ➱ notched
        // ➸ feathered
        // ➻ tear drop-shanked
        // ➼ wedge-tailed
        // ⟼ from bar
        // ⟿ Squiggle
        // ⤞ to diamond
        // ↪ with hook &hookrightarrow;

        // open
        // closed
        // closed strike through
        // closed and filled

        enum ArrowPart 
        {
            Unknown = 0,
            Shaft = 1,
            LeftBlade = 2,
            RightBlade = 3
        }

        private static void DrawArrows(int index, DataDestination destination)
        {
            const int arrowWidth = ImageWidth - 20;
            const int arrowHeight = ImageHeight - 20;
            var startPoint = new Point(0, 0);
            var endPoint = new Point(arrowWidth, arrowHeight);

            var middleX = _random.Next(arrowWidth/10, arrowWidth * 8/10);
            var middleY = _random.Next(arrowWidth / 10, arrowWidth * 8 / 10); //_random.Next(middleX, arrowHeight * 8/10);

            var middlePoint = new Point(middleX, middleY);
            //middlePoint = new Point(arrowWidth * 9/10, arrowHeight);
            var (headAngle, shaftPoints) = DrawArrowShaft(startPoint, middlePoint, endPoint);
            var shaft = (shaftPoints, ArrowPart.Shaft);
            var (leftBladeEnd, rightBladeEnd) = GenerateArrowBladeEnds(arrowWidth, arrowHeight, endPoint, headAngle);

            Func<Point, Point> near = p => new Point(p.X + _random.Next(-3, 3), p.X + _random.Next(-3, 3));

            (IList<Point> points, ArrowPart label) up = (new List<Point>(0), ArrowPart.Unknown);

            // shaft, left->head, right->head
            var left = (Line(leftBladeEnd, endPoint), ArrowPart.LeftBlade);
            var right = (Line(rightBladeEnd, endPoint), ArrowPart.RightBlade);

            SaveAugmented(destination, "arrow-stroke3", index * 100 + 10*0,  shaft, up, left, up, right);

            // shaft, right->head, left->head
            SaveAugmented(destination, "arrow-stroke3", index * 100 + 10 * 1,  shaft, up, right, up, left);

            // shaft, left->head->right
            left = (Line(leftBladeEnd, endPoint), ArrowPart.LeftBlade);
            right = (Line(endPoint, rightBladeEnd), ArrowPart.RightBlade);
            SaveAugmented(destination, "arrow-stroke3", index * 100 + 10 * 2, shaft, up, left, right);

            // right->head->left
            SaveAugmented(destination, "arrow-stroke3", index * 100 + 10 * 3, shaft, up, right, left);

            // head->right->head->left
            var backRight = (Line(rightBladeEnd, endPoint), ArrowPart.RightBlade);
            //SaveAugmented(destination, "arrow-stroke3", index * 100 + 10 * 4, shaft, right, backRight, left);

            // head->left->head->right
            var backLeft = (Line(rightBladeEnd, endPoint), ArrowPart.LeftBlade);
            //SaveAugmented(destination, "arrow-stroke3", index * 100 + 10 * 5, shaft, left, backLeft, right);


            // CreatePicture(g =>
            // {
            //     g.DrawLines(_pen, shaftPoints.Concat(left).Concat(right).ToArray());
            // }, "arrow", index, destination);
        }

        private static (Point leftBladeEnd, Point rightBladeEnd) GenerateArrowBladeEnds(int arrowWidth, int arrowHeight, Point endPoint, double headAngle)
        {
            var leftBladeLen = _random.Next(arrowWidth * 15 / 100, arrowWidth * 50 / 100);
            var rightBladeLen = leftBladeLen * _random.Next(90, 110) / 100;
            var bladeToHeadAngle = Math.PI / 360.0 * _random.Next(15, 30);
            var leftBladeEnd = endPoint;
            leftBladeEnd.X -= (int) Math.Round(Math.Cos(headAngle + bladeToHeadAngle) * leftBladeLen);
            leftBladeEnd.Y -= (int) Math.Round(Math.Sin(headAngle + bladeToHeadAngle) * leftBladeLen);
            var rightBladeEnd = endPoint;
            rightBladeEnd.X -= (int) Math.Round(Math.Cos(headAngle - bladeToHeadAngle) * rightBladeLen);
            rightBladeEnd.Y -= (int) Math.Round(Math.Sin(headAngle - bladeToHeadAngle) * rightBladeLen);
            return (leftBladeEnd, rightBladeEnd);
        }

        static void SaveAugmented(DataDestination destination, string category, int startIndex, params (IList<Point> points, ArrowPart label)[] strokes)
        {
            SaveAsStroke3Json(destination, "arrow-stroke3", startIndex, strokes);
            SaveAsStroke3Json(destination, "arrow-stroke3", startIndex + 1, strokes.Select(FlipX).ToArray());
            SaveAsStroke3Json(destination, "arrow-stroke3", startIndex + 2, strokes.Select(FlipY).ToArray());
            SaveAsStroke3Json(destination, "arrow-stroke3", startIndex + 3, strokes.Select(Flip).ToArray());
        }


        static ArrowPart FlipPart(ArrowPart p) => p == ArrowPart.LeftBlade ? ArrowPart.RightBlade :
            p == ArrowPart.RightBlade ? ArrowPart.LeftBlade : p;
        private static (IList<Point> points, ArrowPart label) FlipX((IList<Point> points, ArrowPart label) stroke)
        {
            return (stroke.points.Select(p => new Point(-p.X, p.Y)).ToList(), FlipPart(stroke.label));
        }

        private static (IList<Point> points, ArrowPart label) FlipY((IList<Point> points, ArrowPart label) stroke)
        {
            return (stroke.points.Select(p => new Point(p.X, -p.Y)).ToList(), FlipPart(stroke.label));
        }

        private static (IList<Point> points, ArrowPart label) Flip((IList<Point> points, ArrowPart label) stroke)
        {
            return (stroke.points.Select(p => new Point(-p.X, -p.Y)).ToList(), stroke.label);
        }

        static void SaveAsStroke3Json(DataDestination destination, string category, int figureIndex, params (IList<Point> points, ArrowPart label)[] strokes)
        {
            var result = new List<int[]>();
            Point? priorPoint = null;
            foreach (var stroke in strokes)
            {
                var points = stroke.points;
                if (!points.Any() && stroke.label == ArrowPart.Unknown) 
                    // pen up marker: set it to last point 
                    result[^1][^2] = 1;

                foreach (var point in points)
                {
                    if (priorPoint != null)
                        result.Add(new[]
                        {
                            point.X - priorPoint.Value.X,
                            point.Y - priorPoint.Value.Y,
                            0,
                            (int)stroke.label 
                        });
                    priorPoint = point;
                }
            }

            var serialized = JsonSerializer.Serialize(result);
            var folder = GetFullPath(DestinationSubfolder(destination));
            var path = Path.Combine(folder, category);
            if (!Directory.Exists(path))
                Directory.CreateDirectory(path);
            File.WriteAllText(Path.Combine(path, $"{figureIndex:D4}.json"), serialized);

        }

        private static (double angle, IList<Point> path) DrawArrowShaft(Point startPoint, Point middlePoint, Point endPoint)
        {
            return BezierCurve(startPoint, middlePoint, endPoint);
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
            var path = GetFullPath(DestinationSubfolder(destination));


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
            //bitmap8Bit.Save($"{Path.Combine(finalPath, $"{figureIndex:D4}.png")}", ImageFormat.Png);
            bitmap.Save($"{Path.Combine(finalPath, $"{index:D4}.png")}", ImageFormat.Png);
        }

        private static string DestinationSubfolder(DataDestination destination)
        {
            var destinationSubfolder = destination switch
            {
                DataDestination.Training => "training",
                DataDestination.Validation => "validation",
                _ => throw new ArgumentOutOfRangeException(nameof(destination), destination, null)
            };
            return destinationSubfolder;
        }

        private static string GetFullPath(string destinationSubfolder)
        {
            return Path.GetFullPath(
                Path.Combine(Assembly.GetExecutingAssembly().Location, $@"..\..\..\..\..\generated-data\{destinationSubfolder}"));
        }
    }
}
