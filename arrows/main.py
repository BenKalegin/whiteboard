from math import atan2

import cv2
import matplotlib.pyplot as plt
import numpy as np
from sklearn import cluster
from sklearn.preprocessing import RobustScaler

rcParams = plt.matplotlib.rcParams


def process_file(filename, index ):
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

    colors_s = ['#1f77b4', '#ff7f0e', '#2ca02c', '#d62728', '#9467bd', '#8c564b', '#e377c2', '#7f7f7f', '#bcbd22', '#17becf']

    line_center_and_angle = []
    for x in range(0, len(lines)):
        for x1, y1, x2, y2 in lines[x]:
            line_angle = atan2(y1 - y2, x1 - x2) * 180 / 3.14159265358979323846
            line_center_and_angle.append([(x1 + x2) / 20, line_angle])

    scaled = RobustScaler().fit_transform(line_center_and_angle)
    clusters = cluster.DBSCAN(eps=0.5)
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


process_file("data/arrow3.PNG", 1)
process_file("data/arrow4.PNG", 2)
process_file("data/arrow5.PNG", 3)
process_file("data/arrow6.PNG", 4)



