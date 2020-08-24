from math import atan2

import cv2
import matplotlib.pyplot as plt
import numpy as np
from sklearn import cluster
from sklearn.preprocessing import RobustScaler


def detect_and_cluster_lines_in_file(filename, index):
    gray = cv2.imread(filename, cv2.IMREAD_GRAYSCALE)
    invert = cv2.bitwise_not(cv2.blur(gray, ksize=(2, 2)))
    # kernel = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (3, 3))
    # dilation = cv2.dilate(invert, kernel, iterations = 1)
    # kernel1 = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (5, 5))
    # erosion = cv2.erode(dilation, kernel1, iterations = 1)
    # cv2.imshow("invert", invert)
    # cv2.imshow("erosion", erosion)
    # cv2.waitKey()
    min_line_length = 20
    max_line_gap = 5
    threshold = int(max(gray.shape[0], gray.shape[1]) / 16)
    lines = cv2.HoughLinesP(invert, cv2.HOUGH_PROBABILISTIC, np.pi / 180, threshold, min_line_length, max_line_gap)
    # temp color image to show line overlay
    output = cv2.imread(filename)
    colors = [
        (0x1f, 0x77, 0xb4),
        (0xff, 0x7f, 0x0e),
        (0x2c, 0xa0, 0x2c),
        (0xd6, 0x27, 0x28),
        (0x94, 0x67, 0xbd),
        (0x8c, 0x56, 0x4b),
        (0xe3, 0x77, 0xc2),
        (0x7f, 0x7f, 0x7f),
        (0xbc, 0xbd, 0x22),
        (0x17, 0xbe, 0xcf)]

    colors_s = ['#1f77b4', '#ff7f0e', '#2ca02c', '#d62728', '#9467bd', '#8c564b', '#e377c2', '#7f7f7f', '#bcbd22',
                '#17becf']

    line_center_and_angle = []
    for x in range(0, len(lines)):
        for x1, y1, x2, y2 in lines[x]:
            line_angle = atan2(y1 - y2, x1 - x2) * 180 / 3.14159265358979323846
            line_center_and_angle.append([(x1 + x2) / 20, line_angle])

    scaled = RobustScaler().fit_transform(line_center_and_angle)
    clusters = cluster.AgglomerativeClustering(n_clusters=5)
    clusters.fit(scaled)
    labels = clusters.labels_.tolist()

    for x in range(0, len(lines)):
        for x1, y1, x2, y2 in lines[x]:
            pts = np.array([[x1, y1], [x2, y2]], np.int32)
            cv2.polylines(output, [pts], True, color=colors[labels[x]], thickness=3)

    plt.figure(index * 100 + 1)
    scaled_list = scaled.tolist()
    for i in range(0, len(scaled_list)):
        x = scaled_list[i]
        plt.scatter(x[0], x[1], c=colors_s[labels[i]])
    plt.show()

    plt.figure(index * 100 + 3)
    font = cv2.FONT_HERSHEY_SIMPLEX
    cv2.putText(output, "line number:" + str(len(lines)), (10, 12), font, 0.5, 255)
    plt.title(filename)
    plt.imshow(output)
    plt.show()


def find_corners(filename: str, index: int):
    gray = cv2.imread(filename, cv2.IMREAD_GRAYSCALE)
    # cornerHarris
    # Input single-channel 8-bit or floating-point image
    # blockSize – Neighborhood size. For every pixel p , the function considers a blockSize*blockSize neighborhood S(p)
    # ksize – Aperture parameter for the Sobel() operator.
    # k – Harris detector free parameter. See the formula below.
    # borderType – Pixel extrapolation method, one of the BORDER_* ,
    # except for BORDER_TRANSPARENT and BORDER_ISOLATED .
    # When borderType==BORDER_CONSTANT , the function always returns -1, regardless of p and len
    #  for each pixel (x, y) it calculates a 2*2 gradient covariance matrix M^{(x,y)}
    #  over a blockSize*blockSize neighborhood. Then, it computes the following characteristic:
    # tt{dst} (x,y) =  \mathrm{det} M^{(x,y)} - k  \cdot \left ( \mathrm{tr} M^{(x,y)} \right )^2
    # Corners in the image can be found as the local maxima of this response map.

    corners = cv2.cornerHarris(gray, 2, 3, 0.05, borderType=cv2.BORDER_REFLECT101)
    corners = cv2.dilate(corners, None)

    output = cv2.imread(filename)
    threshold = 0.05 * corners.max()
    output[corners > threshold] = [0, 0, 255]
    plt.figure(index * 100 + 1)
    plt.title(filename)
    plt.imshow(output)
    plt.show()


# detect_and_cluster_lines_in_file("data/arrow3.PNG", 1)
# detect_and_cluster_lines_in_file("data/arrow4.PNG", 2)
# detect_and_cluster_lines_in_file("data/arrow5.PNG", 3)
# detect_and_cluster_lines_in_file("data/arrow6.PNG", 4)

find_corners("data/arrow3.PNG", 1)
find_corners("data/arrow4.PNG", 2)
find_corners("data/arrow5.PNG", 3)
find_corners("data/arrow6.PNG", 4)
