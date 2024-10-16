***
Implementation of software developed using HTML, CSS and Javascript technologies to draw and paint the internal region of polygons (fillpoly algorithm).
***
The algorithm for drawing a polygon and filling it, in solid color or not, is known as fillpoly and runs in the 2D universe using coordinates in SRT.
As the internal region of a polygon has many pixels, it is necessary an accurate and fast rasterization algorithm using arithmetic incremental, where a new value is calculated from a previous value added by a fixed installment.
The fillpoly algorithm identifies which scanlines should be processed, recording all intersections between them and the edges that make up the border of the polygon.
***
