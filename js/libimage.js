function noiseDetect(data, x, y) {
    var vector = [[0, -1], [0, 1], [1, -1], [1, 1], [-1, -1], [-1, 1], [1, 0], [-1, 0]];
    var all = 0;
    for (var i = 0; i < 8; i++) {
        var xx = x + vector[i][0];
        var yy = y + vector[i][1];
        if (xx >= 0 && xx < 22 && yy >= 0 && yy < 55) {
            if (data[xx * 55 + yy] == 1) {
                all++;
            }
        }
    }
    if (all <= 1)
        return true;
    return false;
}

function preprocessImg(imgdata) {
    var data = Array();
    for (var i = 0, j = 0; i < 4840; i += 4, j++) {
        a = imgdata[i], b = imgdata[i + 1], c = imgdata[i + 2];
        if (a + b + c <= 340 && (!(a == b && b == c)) && (a <= 150 || b <= 150 || c <= 150))
            data[j] = 1;
        else
            data[j] = 0;
    }
    var todo = [];
    for (var i = 0; i < 22; i++) {
        for (var j = 0; j < 55; j++) {
            if (data[i * 55 + j] == 0)
                continue;
            if (i == 0 || j == 0) {
                todo.push([i, j]);
                continue;
            }
            if (noiseDetect(data, i, j))
                todo.push([i, j]);
        }
    }
    for (var i = 0; i < todo.length; i++) {
        x = todo[i][0], y = todo[i][1];
        data[x * 55 + y] = 0;
    }
    return data;
}

function split(l, data) {
    b = [];
    for (var i = 0; i < 22; i++) {
        a = [];
        for (var j = 0; j < 55; j++)
            a.push(data[i * 55 + j]);
        b.push(a.join(' '));
    }
    console.log(b.join('\n'));

    //清除上下区域的噪点
    var row = Array();
    for (var i = 0; i < 22; i++) {
        row[i] = 0;
        for (var j = 0; j < 55; j++)
            row[i] += data[i * 55 + j];
    }
    var rthreshold = 17;
    var r0 = 0, r1 = 21;
    for (var i = 11; i >= 0; i--) {
        if (row[i] < 2) {
            r0 = i + 1;
            break
        }
    }
    for (var i = 11; i < 22; i++) {
        if (row[i] < 2) {
            r1 = i - 1;
            break
        }
    }
    var r = r1 - r0 + 1;
    if (r > rthreshold) {
        r1 -= (r - rthreshold) / 2;
        r0 += (r - rthreshold) - (r - rthreshold) / 2;
    }
    for (var i = 0; i < r0; i++) {
        for (var j = 0; j < 55; j++)
            data[i * 55 + j] = 0;
    }
    for (var i = r1 + 1; i < 22; i++) {
        for (var j = 0; j < 55; j++) {
            data[i * 55 + j] = 0;
        }
    }

    //清除左右区域的噪点
    var col = Array();
    for (var i = 0; i < 55; i++) {
        col[i] = 0;
        for (var j = 0; j < 22; j++)
            col[i] += data[j * 55 + i];
    }
    var cthreshold = 17;
    var c0 = 0, c1 = 54;
    for (var i = 0; i < 27; i++) {
        if (col[i] > 0) {
            c0 = i;
            break
        }
    }
    for (var i = 54; i > 27; i--) {
        if (col[i] > 0) {
            c1 = i;
            break
        }
    }

    //字符切割
    for (var i = 0; i < 55; i++) {
        col[i] = 0;
        for (var j = 0; j < 22; j++)
            col[i] += data[j * 55 + i];
    }
    var pos = [];
    var front = c0;
    for (var i = c0 + 1; i <= c1; i++) {
        if (i <= front)
            continue;
        if (col[i] != 0 && i - front > 16) {
            var p = argmin(col, front + 5, i) + front + 5;
            pos.push([front, p]);
            front = p;
        }
        if (col[i] == 0 || i == c1) {
            if (i - front <= 3 && argsum(col, front, i) < 10) {
            }
            else if (i - front <= 16) {
                pos.push([front, i - 1]);
            }
            else if (i - front > 16) {
                p = argmin(col, front + 5, i - 5) + front + 5;
                pos.push([front, p]);
                pos.push([p, i - 1]);
            }
            front = i + 1;
            while (front <= c1 && col[front] == 0)
                front++;
        }
    }

    if (pos.length != l)
        return [false, false]

    var ret = [];
    for (var i = 0; i < 4; i++) {
        var a = pos[i];
        var char = new Array();
        for (var p = 0; p < rthreshold; p++) {
            for (var q = 0; q < cthreshold; q++) {
                char[p * cthreshold + q] = [0];
                if (p + r0 <= r1 && q + a[0] <= a[1])
                    char[p * cthreshold + q][0] = data[(p + r0) * 55 + q + a[0]];
            }
        }
        ret.push(char);
    }
    return [true, ret];
}


function getImgEle() {
    var img = document.getElementById('imgRandom');//dean student
    if(img==null){//genearch
        img=document.getElementById('RandomPhoto').firstElementChild;
    }
    var canvas = document.createElement("canvas");
    canvas.width = 55;
    canvas.height = 22;
    ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0);
    imgdata = ctx.getImageData(0, 0, 55, 22).data;
    return imgdata;
}

function recognize(ws, bs, x) {
    function sigmoid(a) {
        for (var i = 0; i < a.length; i++)
            a[i][0] = 1.0 / (1.0 + Math.exp(-a[i][0]));
        return a;
    }

    for (var i = 0; i < ws.length; i++) {
        x = sigmoid(mat_add(mat_mul(ws[i], x), bs[i]));
    }
    return String.fromCharCode(65 + argmax(x, 0, ws[ws.length - 1].length));
}

function img2string(l, name,callback1) {
    imgdata = getImgEle();
    data = preprocessImg(imgdata);
    ret = split(l, data);
    if (!ret[0]){
        callback1(false);
        return;
    }
    x = ret[1];
    getData(name,function (data) {
        var ws = data["weights"];
        var bs = data["biases"];
        verif_code = [];
        for (var i = 0; i < l; i++)
            verif_code.push(recognize(ws, bs, x[i]));
        callback1(verif_code.join(''));
    });
}