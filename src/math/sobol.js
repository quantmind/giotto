    var BITS = 52,
        SCALE = 2 << 51,
        MAX_DIMENSION = 21201,
        COEFFICIENTS = [
            'd       s       a       m_i',
            '2       1       0       1',
            '3       2       1       1 3',
            '4       3       1       1 3 1',
            '5       3       2       1 1 1',
            '6       4       1       1 1 3 3',
            '7       4       4       1 3 5 13',
            '8       5       2       1 1 5 5 17',
            '9       5       4       1 1 5 5 5',
            '10      5       7       1 1 7 11 1'
        ];


    g.math.sobol = function (dim) {
        if (dim < 1 || dim > MAX_DIMENSION) throw new Error("Out of range dimension");
        var sobol = {},
            count = 0,
            direction = [],
            x = [],
            zero = [],
            lines,
            i;

        sobol.next = function() {
            var v = [];
            if (count === 0) {
                count++;
                return zero.slice();
            }
            var c = 1;
            var value = count - 1;
            while ((value & 1) == 1) {
                value >>= 1;
                c++;
            }
            for (i = 0; i < dim; i++) {
                x[i] ^= direction[i][c];
                v[i] = x[i] / SCALE;
            }
            count++;
            return v;
        };

        sobol.dimension = function () {
            return dim;
        };

        sobol.count = function () {
            return count;
        };


        var tmp = [];
        for (i = 0; i <= BITS; i++) tmp.push(0);
        for (i = 0; i < dim; i++) {
            direction[i] = tmp.slice();
            x[i] = 0;
            zero[i] = 0;
        }

        if (dim > COEFFICIENTS.length) {
            throw new Error("Out of range dimension");
            //var data = fs.readFileSync(file);
            //lines = ("" + data).split("\n");
        }
        else
            lines = COEFFICIENTS;

        for (i = 1; i <= BITS; i++) direction[0][i] = 1 << (BITS - i);
        for (var d = 1; d < dim; d++) {
            var cells = lines[d].split(/\s+/);
            var s = +cells[1];
            var a = +cells[2];
            var m = [0];
            for (i = 0; i < s; i++) m.push(+cells[3 + i]);
            for (i = 1; i <= s; i++) direction[d][i] = m[i] << (BITS - i);
            for (i = s + 1; i <= BITS; i++) {
                direction[d][i] = direction[d][i - s] ^ (direction[d][i - s] >> s);
                for (var k = 1; k <= s - 1; k++)
                direction[d][i] ^= ((a >> (s - 1 - k)) & 1) * direction[d][i - k];
            }
        }

        return sobol;
    };
