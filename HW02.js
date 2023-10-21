var canvas;
var gl;

var NumVertices = 18; // 피라미드의 정점 수

var points = [];
var colors = [];

var xAxis = 0;
var yAxis = 1;
var zAxis = 2;

var axis = 0;
var theta = [0, 0, 0];

var thetaLoc;

var flag = true;

window.onload = function init() {
    canvas = document.getElementById("gl-canvas");

    gl = WebGLUtils.setupWebGL(canvas);
    if (!gl) {
        alert("WebGL isn't available");
    }

    colorPyramid(); // 피라미드 생성 함수 호출

    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(1.0, 1.0, 1.0, 1.0);

    gl.enable(gl.DEPTH_TEST);

    //
    //  Load shaders and initialize attribute buffers
    //
    var program = initShaders(gl, "vertex-shader", "fragment-shader");
    gl.useProgram(program);

    var cBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, cBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(colors), gl.STATIC_DRAW);

    var vColor = gl.getAttribLocation(program, "vColor");
    gl.vertexAttribPointer(vColor, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vColor);

    var vBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW);

    var vPosition = gl.getAttribLocation(program, "vPosition");
    gl.vertexAttribPointer(vPosition, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);

    thetaLoc = gl.getUniformLocation(program, "theta");

    // event listeners for buttons

    document.getElementById("xButton").onclick = function () {
        axis = xAxis;
    };
    document.getElementById("yButton").onclick = function () {
        axis = yAxis;
    };
    document.getElementById("zButton").onclick = function () {
        axis = zAxis;
    };
    document.getElementById("ButtonT").onclick = function () {
        flag = !flag;
    };

    render();
}

function colorPyramid() {
    // 피라미드의 정점 좌표 정의
    var vertices = [
        vec4(0.0, 0.5, 0.0, 1.0),  // 정상 (top)
        vec4(-0.5, -0.5, 0.5, 1.0),  // 왼쪽 아래 앞면 (bottom-left-front)
        vec4(0.5, -0.5, 0.5, 1.0),   // 오른쪽 아래 앞면 (bottom-right-front)
        vec4(0.5, -0.5, -0.5, 1.0),  // 오른쪽 아래 뒷면 (bottom-right-back)
        vec4(-0.5, -0.5, -0.5, 1.0)  // 왼쪽 아래 뒷면 (bottom-left-back)
    ];

    // 각 면의 색상 정의
    var faceColors = [
        [1.0, 0.0, 0.0, 1.0],  // 빨강
        [0.0, 1.0, 0.0, 1.0],  // 녹색
        [0.0, 0.0, 1.0, 1.0],  // 파랑  
    ];

    // 각 면에 대한 정점 인덱스
    var indices = [
        1, 2, 3, 1, 3, 4, // 앞면 (front)
        1, 5, 2, // 왼쪽 면 (left)
        2, 5, 3, // 오른쪽 면 (right)
        3, 5, 4, 4, 5, 1  // 바닥 (bottom)
    ];

    // 정점과 색상 데이터를 생성
    for (var i = 0; i < indices.length; ++i) {
        var vertexIndex = indices[i] - 1; // 1부터 시작하는 인덱스를 0부터 시작하도록 조정
        var colorIndex = Math.floor(i / 6); // 각 면당 6개의 정점

        points.push(vertices[vertexIndex]);
        colors.push(faceColors[colorIndex]);
    }
}

function render() {
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    if (flag) theta[axis] += 2.0;
    gl.uniform3fv(thetaLoc, theta);

    gl.drawArrays(gl.TRIANGLES, 0, NumVertices);

    requestAnimFrame(render);
}
