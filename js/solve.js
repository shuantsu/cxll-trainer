// Generated by CoffeeScript 1.6.3
(function() {
  var BL, BR, Cnk, Cube, DB, DBL, DF, DFR, DL, DLF, DR, DRB, FL, FR, Include, N_FLIP, N_FRtoBR, N_PARITY, N_SLICE1, N_SLICE2, N_TWIST, N_UBtoDF, N_URFtoDLF, N_URtoDF, N_URtoUL, UB, UBR, UF, UFL, UL, ULB, UR, URF, allMoves1, allMoves2, computeMoveTable, computePruningTable, factorial, key, max, mergeURtoDF, moveTableParams, nextMoves1, nextMoves2, permutationIndex, pruning, pruningTableParams, rotateLeft, rotateRight, value, _ref, _ref1,
    __slice = [].slice,
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  Cube = this.Cube || require('./cube');

  _ref = [0, 1, 2, 3, 4, 5, 6, 7], URF = _ref[0], UFL = _ref[1], ULB = _ref[2], UBR = _ref[3], DFR = _ref[4], DLF = _ref[5], DBL = _ref[6], DRB = _ref[7];

  _ref1 = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11], UR = _ref1[0], UF = _ref1[1], UL = _ref1[2], UB = _ref1[3], DR = _ref1[4], DF = _ref1[5], DL = _ref1[6], DB = _ref1[7], FR = _ref1[8], FL = _ref1[9], BL = _ref1[10], BR = _ref1[11];

  Cnk = function(n, k) {
    var i, j, s;
    if (n < k) {
      return 0;
    }
    if (k > n / 2) {
      k = n - k;
    }
    s = 1;
    i = n;
    j = 1;
    while (i !== n - k) {
      s *= i;
      s /= j;
      i--;
      j++;
    }
    return s;
  };

  factorial = function(n) {
    var f, i, _i;
    f = 1;
    for (i = _i = 2; 2 <= n ? _i <= n : _i >= n; i = 2 <= n ? ++_i : --_i) {
      f *= i;
    }
    return f;
  };

  max = function(a, b) {
    if (a > b) {
      return a;
    } else {
      return b;
    }
  };

  rotateLeft = function(array, l, r) {
    var i, tmp, _i, _ref2;
    tmp = array[l];
    for (i = _i = l, _ref2 = r - 1; l <= _ref2 ? _i <= _ref2 : _i >= _ref2; i = l <= _ref2 ? ++_i : --_i) {
      array[i] = array[i + 1];
    }
    return array[r] = tmp;
  };

  rotateRight = function(array, l, r) {
    var i, tmp, _i, _ref2;
    tmp = array[r];
    for (i = _i = r, _ref2 = l + 1; r <= _ref2 ? _i <= _ref2 : _i >= _ref2; i = r <= _ref2 ? ++_i : --_i) {
      array[i] = array[i - 1];
    }
    return array[l] = tmp;
  };

  permutationIndex = function(context, start, end, fromEnd) {
    var i, maxAll, maxB, maxOur, our, permName;
    if (fromEnd == null) {
      fromEnd = false;
    }
    maxOur = end - start;
    maxB = factorial(maxOur + 1);
    if (context === 'corners') {
      maxAll = 7;
      permName = 'cp';
    } else {
      maxAll = 11;
      permName = 'ep';
    }
    our = (function() {
      var _i, _results;
      _results = [];
      for (i = _i = 0; 0 <= maxOur ? _i <= maxOur : _i >= maxOur; i = 0 <= maxOur ? ++_i : --_i) {
        _results.push(0);
      }
      return _results;
    })();
    return function(index) {
      var a, b, c, j, k, perm, x, _i, _j, _k, _l, _m, _n, _o, _p, _q, _ref2, _ref3;
      if (index != null) {
        for (i = _i = 0; 0 <= maxOur ? _i <= maxOur : _i >= maxOur; i = 0 <= maxOur ? ++_i : --_i) {
          our[i] = i + start;
        }
        b = index % maxB;
        a = index / maxB | 0;
        perm = this[permName];
        for (i = _j = 0; 0 <= maxAll ? _j <= maxAll : _j >= maxAll; i = 0 <= maxAll ? ++_j : --_j) {
          perm[i] = -1;
        }
        for (j = _k = 1; 1 <= maxOur ? _k <= maxOur : _k >= maxOur; j = 1 <= maxOur ? ++_k : --_k) {
          k = b % (j + 1);
          b = b / (j + 1) | 0;
          while (k > 0) {
            rotateRight(our, 0, j);
            k--;
          }
        }
        x = maxOur;
        if (fromEnd) {
          for (j = _l = 0; 0 <= maxAll ? _l <= maxAll : _l >= maxAll; j = 0 <= maxAll ? ++_l : --_l) {
            c = Cnk(maxAll - j, x + 1);
            if (a - c >= 0) {
              perm[j] = our[maxOur - x];
              a -= c;
              x--;
            }
          }
        } else {
          for (j = _m = maxAll; maxAll <= 0 ? _m <= 0 : _m >= 0; j = maxAll <= 0 ? ++_m : --_m) {
            c = Cnk(j, x + 1);
            if (a - c >= 0) {
              perm[j] = our[x];
              a -= c;
              x--;
            }
          }
        }
        return this;
      } else {
        perm = this[permName];
        for (i = _n = 0; 0 <= maxOur ? _n <= maxOur : _n >= maxOur; i = 0 <= maxOur ? ++_n : --_n) {
          our[i] = -1;
        }
        a = b = x = 0;
        if (fromEnd) {
          for (j = _o = maxAll; maxAll <= 0 ? _o <= 0 : _o >= 0; j = maxAll <= 0 ? ++_o : --_o) {
            if ((start <= (_ref2 = perm[j]) && _ref2 <= end)) {
              a += Cnk(maxAll - j, x + 1);
              our[maxOur - x] = perm[j];
              x++;
            }
          }
        } else {
          for (j = _p = 0; 0 <= maxAll ? _p <= maxAll : _p >= maxAll; j = 0 <= maxAll ? ++_p : --_p) {
            if ((start <= (_ref3 = perm[j]) && _ref3 <= end)) {
              a += Cnk(j, x + 1);
              our[x] = perm[j];
              x++;
            }
          }
        }
        for (j = _q = maxOur; maxOur <= 0 ? _q <= 0 : _q >= 0; j = maxOur <= 0 ? ++_q : --_q) {
          k = 0;
          while (our[j] !== start + j) {
            rotateLeft(our, 0, j);
            k++;
          }
          b = (j + 1) * b + k;
        }
        return a * maxB + b;
      }
    };
  };

  Include = {
    twist: function(twist) {
      var i, ori, parity, v, _i, _j;
      if (twist != null) {
        parity = 0;
        for (i = _i = 6; _i >= 0; i = --_i) {
          ori = twist % 3;
          twist = (twist / 3) | 0;
          this.co[i] = ori;
          parity += ori;
        }
        this.co[7] = (3 - parity % 3) % 3;
        return this;
      } else {
        v = 0;
        for (i = _j = 0; _j <= 6; i = ++_j) {
          v = 3 * v + this.co[i];
        }
        return v;
      }
    },
    flip: function(flip) {
      var i, ori, parity, v, _i, _j;
      if (flip != null) {
        parity = 0;
        for (i = _i = 10; _i >= 0; i = --_i) {
          ori = flip % 2;
          flip = flip / 2 | 0;
          this.eo[i] = ori;
          parity += ori;
        }
        this.eo[11] = (2 - parity % 2) % 2;
        return this;
      } else {
        v = 0;
        for (i = _j = 0; _j <= 10; i = ++_j) {
          v = 2 * v + this.eo[i];
        }
        return v;
      }
    },
    cornerParity: function() {
      var i, j, s, _i, _j, _ref2, _ref3;
      s = 0;
      for (i = _i = DRB, _ref2 = URF + 1; DRB <= _ref2 ? _i <= _ref2 : _i >= _ref2; i = DRB <= _ref2 ? ++_i : --_i) {
        for (j = _j = _ref3 = i - 1; _ref3 <= URF ? _j <= URF : _j >= URF; j = _ref3 <= URF ? ++_j : --_j) {
          if (this.cp[j] > this.cp[i]) {
            s++;
          }
        }
      }
      return s % 2;
    },
    edgeParity: function() {
      var i, j, s, _i, _j, _ref2, _ref3;
      s = 0;
      for (i = _i = BR, _ref2 = UR + 1; BR <= _ref2 ? _i <= _ref2 : _i >= _ref2; i = BR <= _ref2 ? ++_i : --_i) {
        for (j = _j = _ref3 = i - 1; _ref3 <= UR ? _j <= UR : _j >= UR; j = _ref3 <= UR ? ++_j : --_j) {
          if (this.ep[j] > this.ep[i]) {
            s++;
          }
        }
      }
      return s % 2;
    },
    URFtoDLF: permutationIndex('corners', URF, DLF),
    URtoUL: permutationIndex('edges', UR, UL),
    UBtoDF: permutationIndex('edges', UB, DF),
    URtoDF: permutationIndex('edges', UR, DF),
    FRtoBR: permutationIndex('edges', FR, BR, true)
  };

  for (key in Include) {
    value = Include[key];
    Cube.prototype[key] = value;
  }

  computeMoveTable = function(context, coord, size) {
    var apply, cube, i, inner, j, k, move, _i, _j, _k, _ref2, _results;
    apply = context === 'corners' ? 'cornerMultiply' : 'edgeMultiply';
    cube = new Cube;
    _results = [];
    for (i = _i = 0, _ref2 = size - 1; 0 <= _ref2 ? _i <= _ref2 : _i >= _ref2; i = 0 <= _ref2 ? ++_i : --_i) {
      cube[coord](i);
      inner = [];
      for (j = _j = 0; _j <= 5; j = ++_j) {
        move = Cube.moves[j];
        for (k = _k = 0; _k <= 2; k = ++_k) {
          cube[apply](move);
          inner.push(cube[coord]());
        }
        cube[apply](move);
      }
      _results.push(inner);
    }
    return _results;
  };

  mergeURtoDF = (function() {
    var a, b;
    a = new Cube;
    b = new Cube;
    return function(URtoUL, UBtoDF) {
      var i, _i;
      a.URtoUL(URtoUL);
      b.UBtoDF(UBtoDF);
      for (i = _i = 0; _i <= 7; i = ++_i) {
        if (a.ep[i] !== -1) {
          if (b.ep[i] !== -1) {
            return -1;
          } else {
            b.ep[i] = a.ep[i];
          }
        }
      }
      return b.URtoDF();
    };
  })();

  N_TWIST = 2187;

  N_FLIP = 2048;

  N_PARITY = 2;

  N_FRtoBR = 11880;

  N_SLICE1 = 495;

  N_SLICE2 = 24;

  N_URFtoDLF = 20160;

  N_URtoDF = 20160;

  N_URtoUL = 1320;

  N_UBtoDF = 1320;

  Cube.moveTables = {
    parity: [[1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 0, 1], [0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0]],
    twist: null,
    flip: null,
    FRtoBR: null,
    URFtoDLF: null,
    URtoDF: null,
    URtoUL: null,
    UBtoDF: null,
    mergeURtoDF: null
  };

  moveTableParams = {
    twist: ['corners', N_TWIST],
    flip: ['edges', N_FLIP],
    FRtoBR: ['edges', N_FRtoBR],
    URFtoDLF: ['corners', N_URFtoDLF],
    URtoDF: ['edges', N_URtoDF],
    URtoUL: ['edges', N_URtoUL],
    UBtoDF: ['edges', N_UBtoDF],
    mergeURtoDF: []
  };

  Cube.computeMoveTables = function() {
    var name, scope, size, tableName, tables, _i, _len, _ref2;
    tables = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
    if (tables.length === 0) {
      tables = (function() {
        var _results;
        _results = [];
        for (name in moveTableParams) {
          _results.push(name);
        }
        return _results;
      })();
    }
    for (_i = 0, _len = tables.length; _i < _len; _i++) {
      tableName = tables[_i];
      if (this.moveTables[tableName] !== null) {
        continue;
      }
      if (tableName === 'mergeURtoDF') {
        this.moveTables.mergeURtoDF = (function() {
          var UBtoDF, URtoUL, _j, _results;
          _results = [];
          for (URtoUL = _j = 0; _j <= 335; URtoUL = ++_j) {
            _results.push((function() {
              var _k, _results1;
              _results1 = [];
              for (UBtoDF = _k = 0; _k <= 335; UBtoDF = ++_k) {
                _results1.push(mergeURtoDF(URtoUL, UBtoDF));
              }
              return _results1;
            })());
          }
          return _results;
        })();
      } else {
        _ref2 = moveTableParams[tableName], scope = _ref2[0], size = _ref2[1];
        this.moveTables[tableName] = computeMoveTable(scope, tableName, size);
      }
    }
    return this;
  };

  allMoves1 = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17];

  nextMoves1 = (function() {
    var face, lastFace, next, power, _i, _j, _k, _results;
    _results = [];
    for (lastFace = _i = 0; _i <= 5; lastFace = ++_i) {
      next = [];
      for (face = _j = 0; _j <= 5; face = ++_j) {
        if (face !== lastFace && face !== lastFace - 3) {
          for (power = _k = 0; _k <= 2; power = ++_k) {
            next.push(face * 3 + power);
          }
        }
      }
      _results.push(next);
    }
    return _results;
  })();

  allMoves2 = [0, 1, 2, 4, 7, 9, 10, 11, 13, 16];

  nextMoves2 = (function() {
    var face, lastFace, next, power, powers, _i, _j, _k, _len, _results;
    _results = [];
    for (lastFace = _i = 0; _i <= 5; lastFace = ++_i) {
      next = [];
      for (face = _j = 0; _j <= 5; face = ++_j) {
        if (!(face !== lastFace && face !== lastFace - 3)) {
          continue;
        }
        powers = face === 0 || face === 3 ? [0, 1, 2] : [1];
        for (_k = 0, _len = powers.length; _k < _len; _k++) {
          power = powers[_k];
          next.push(face * 3 + power);
        }
      }
      _results.push(next);
    }
    return _results;
  })();

  pruning = function(table, index, value) {
    var pos, shift, slot;
    pos = index % 8;
    slot = index >> 3;
    shift = pos << 2;
    if (value != null) {
      table[slot] &= ~(0xF << shift);
      table[slot] |= value << shift;
      return value;
    } else {
      return (table[slot] & (0xF << shift)) >>> shift;
    }
  };

  computePruningTable = function(phase, size, currentCoords, nextIndex) {
    var current, depth, done, index, move, moves, next, table, x, _i, _j, _len, _ref2;
    table = (function() {
      var _i, _ref2, _results;
      _results = [];
      for (x = _i = 0, _ref2 = Math.ceil(size / 8) - 1; 0 <= _ref2 ? _i <= _ref2 : _i >= _ref2; x = 0 <= _ref2 ? ++_i : --_i) {
        _results.push(0xFFFFFFFF);
      }
      return _results;
    })();
    if (phase === 1) {
      moves = allMoves1;
    } else {
      moves = allMoves2;
    }
    depth = 0;
    pruning(table, 0, depth);
    done = 1;
    while (done !== size) {
      for (index = _i = 0, _ref2 = size - 1; 0 <= _ref2 ? _i <= _ref2 : _i >= _ref2; index = 0 <= _ref2 ? ++_i : --_i) {
        if (!(pruning(table, index) === depth)) {
          continue;
        }
        current = currentCoords(index);
        for (_j = 0, _len = moves.length; _j < _len; _j++) {
          move = moves[_j];
          next = nextIndex(current, move);
          if (pruning(table, next) === 0xF) {
            pruning(table, next, depth + 1);
            done++;
          }
        }
      }
      depth++;
    }
    return table;
  };

  Cube.pruningTables = {
    sliceTwist: null,
    sliceFlip: null,
    sliceURFtoDLFParity: null,
    sliceURtoDFParity: null
  };

  pruningTableParams = {
    sliceTwist: [
      1, N_SLICE1 * N_TWIST, function(index) {
        return [index % N_SLICE1, index / N_SLICE1 | 0];
      }, function(current, move) {
        var newSlice, newTwist, slice, twist;
        slice = current[0], twist = current[1];
        newSlice = Cube.moveTables.FRtoBR[slice * 24][move] / 24 | 0;
        newTwist = Cube.moveTables.twist[twist][move];
        return newTwist * N_SLICE1 + newSlice;
      }
    ],
    sliceFlip: [
      1, N_SLICE1 * N_FLIP, function(index) {
        return [index % N_SLICE1, index / N_SLICE1 | 0];
      }, function(current, move) {
        var flip, newFlip, newSlice, slice;
        slice = current[0], flip = current[1];
        newSlice = Cube.moveTables.FRtoBR[slice * 24][move] / 24 | 0;
        newFlip = Cube.moveTables.flip[flip][move];
        return newFlip * N_SLICE1 + newSlice;
      }
    ],
    sliceURFtoDLFParity: [
      2, N_SLICE2 * N_URFtoDLF * N_PARITY, function(index) {
        return [index % 2, (index / 2 | 0) % N_SLICE2, (index / 2 | 0) / N_SLICE2 | 0];
      }, function(current, move) {
        var URFtoDLF, newParity, newSlice, newURFtoDLF, parity, slice;
        parity = current[0], slice = current[1], URFtoDLF = current[2];
        newParity = Cube.moveTables.parity[parity][move];
        newSlice = Cube.moveTables.FRtoBR[slice][move];
        newURFtoDLF = Cube.moveTables.URFtoDLF[URFtoDLF][move];
        return (newURFtoDLF * N_SLICE2 + newSlice) * 2 + newParity;
      }
    ],
    sliceURtoDFParity: [
      2, N_SLICE2 * N_URtoDF * N_PARITY, function(index) {
        return [index % 2, (index / 2 | 0) % N_SLICE2, (index / 2 | 0) / N_SLICE2 | 0];
      }, function(current, move) {
        var URtoDF, newParity, newSlice, newURtoDF, parity, slice;
        parity = current[0], slice = current[1], URtoDF = current[2];
        newParity = Cube.moveTables.parity[parity][move];
        newSlice = Cube.moveTables.FRtoBR[slice][move];
        newURtoDF = Cube.moveTables.URtoDF[URtoDF][move];
        return (newURtoDF * N_SLICE2 + newSlice) * 2 + newParity;
      }
    ]
  };

  Cube.computePruningTables = function() {
    var name, params, tableName, tables, _i, _len;
    tables = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
    if (tables.length === 0) {
      tables = (function() {
        var _results;
        _results = [];
        for (name in pruningTableParams) {
          _results.push(name);
        }
        return _results;
      })();
    }
    for (_i = 0, _len = tables.length; _i < _len; _i++) {
      tableName = tables[_i];
      if (this.pruningTables[tableName] !== null) {
        continue;
      }
      params = pruningTableParams[tableName];
      this.pruningTables[tableName] = computePruningTable.apply(null, params);
    }
    return this;
  };

  Cube.initSolver = function() {
    Cube.computeMoveTables();
    return Cube.computePruningTables();
  };

  Cube.prototype.solve = function(maxDepth) {
    var State, freeStates, moveNames, phase1, phase1search, phase2, phase2search, solution, state, x;
    if (maxDepth == null) {
      maxDepth = 22;
    }
    moveNames = (function() {
      var face, faceName, power, powerName, result, _i, _j;
      faceName = ['U', 'F', 'L', 'D', 'B', 'R'];
      powerName = ['', '2', "'"];
      result = [];
      for (face = _i = 0; _i <= 5; face = ++_i) {
        for (power = _j = 0; _j <= 2; power = ++_j) {
          result.push(faceName[face] + powerName[power]);
        }
      }
      return result;
    })();
    State = (function() {
      function State(cube) {
        this.parent = null;
        this.lastMove = null;
        this.depth = 0;
        if (cube) {
          this.init(cube);
        }
      }

      State.prototype.init = function(cube) {
        this.flip = cube.flip();
        this.twist = cube.twist();
        this.slice = cube.FRtoBR() / N_SLICE2 | 0;
        this.parity = cube.cornerParity();
        this.URFtoDLF = cube.URFtoDLF();
        this.FRtoBR = cube.FRtoBR();
        this.URtoUL = cube.URtoUL();
        this.UBtoDF = cube.UBtoDF();
        return this;
      };

      State.prototype.solution = function() {
        if (this.parent) {
          return this.parent.solution() + moveNames[this.lastMove] + ' ';
        } else {
          return '';
        }
      };

      State.prototype.move = function(table, index, move) {
        return Cube.moveTables[table][index][move];
      };

      State.prototype.pruning = function(table, index) {
        return pruning(Cube.pruningTables[table], index);
      };

      State.prototype.moves1 = function() {
        if (this.lastMove !== null) {
          return nextMoves1[this.lastMove / 3 | 0];
        } else {
          return allMoves1;
        }
      };

      State.prototype.minDist1 = function() {
        var d1, d2;
        d1 = this.pruning('sliceFlip', N_SLICE1 * this.flip + this.slice);
        d2 = this.pruning('sliceTwist', N_SLICE1 * this.twist + this.slice);
        return max(d1, d2);
      };

      State.prototype.next1 = function(move) {
        var next;
        next = freeStates.pop();
        next.parent = this;
        next.lastMove = move;
        next.depth = this.depth + 1;
        next.flip = this.move('flip', this.flip, move);
        next.twist = this.move('twist', this.twist, move);
        next.slice = this.move('FRtoBR', this.slice * 24, move) / 24 | 0;
        return next;
      };

      State.prototype.moves2 = function() {
        if (this.lastMove !== null) {
          return nextMoves2[this.lastMove / 3 | 0];
        } else {
          return allMoves2;
        }
      };

      State.prototype.minDist2 = function() {
        var d1, d2, index1, index2;
        index1 = (N_SLICE2 * this.URtoDF + this.FRtoBR) * N_PARITY + this.parity;
        d1 = this.pruning('sliceURtoDFParity', index1);
        index2 = (N_SLICE2 * this.URFtoDLF + this.FRtoBR) * N_PARITY + this.parity;
        d2 = this.pruning('sliceURFtoDLFParity', index2);
        return max(d1, d2);
      };

      State.prototype.init2 = function(top) {
        if (top == null) {
          top = true;
        }
        if (this.parent === null) {
          return;
        }
        this.parent.init2(false);
        this.URFtoDLF = this.move('URFtoDLF', this.parent.URFtoDLF, this.lastMove);
        this.FRtoBR = this.move('FRtoBR', this.parent.FRtoBR, this.lastMove);
        this.parity = this.move('parity', this.parent.parity, this.lastMove);
        this.URtoUL = this.move('URtoUL', this.parent.URtoUL, this.lastMove);
        this.UBtoDF = this.move('UBtoDF', this.parent.UBtoDF, this.lastMove);
        if (top) {
          return this.URtoDF = this.move('mergeURtoDF', this.URtoUL, this.UBtoDF);
        }
      };

      State.prototype.next2 = function(move) {
        var next;
        next = freeStates.pop();
        next.parent = this;
        next.lastMove = move;
        next.depth = this.depth + 1;
        next.URFtoDLF = this.move('URFtoDLF', this.URFtoDLF, move);
        next.FRtoBR = this.move('FRtoBR', this.FRtoBR, move);
        next.parity = this.move('parity', this.parity, move);
        next.URtoDF = this.move('URtoDF', this.URtoDF, move);
        return next;
      };

      return State;

    })();
    solution = null;
    phase1search = function(state) {
      var depth, _i, _results;
      depth = 0;
      _results = [];
      for (depth = _i = 1; 1 <= maxDepth ? _i <= maxDepth : _i >= maxDepth; depth = 1 <= maxDepth ? ++_i : --_i) {
        phase1(state, depth);
        if (solution !== null) {
          break;
        }
        _results.push(depth++);
      }
      return _results;
    };
    phase1 = function(state, depth) {
      var move, next, _i, _len, _ref2, _ref3, _results;
      if (depth === 0) {
        if (state.minDist1() === 0) {
          if (state.lastMove === null || (_ref2 = state.lastMove, __indexOf.call(allMoves2, _ref2) < 0)) {
            return phase2search(state);
          }
        }
      } else if (depth > 0) {
        if (state.minDist1() <= depth) {
          _ref3 = state.moves1();
          _results = [];
          for (_i = 0, _len = _ref3.length; _i < _len; _i++) {
            move = _ref3[_i];
            next = state.next1(move);
            phase1(next, depth - 1);
            freeStates.push(next);
            if (solution !== null) {
              break;
            } else {
              _results.push(void 0);
            }
          }
          return _results;
        }
      }
    };
    phase2search = function(state) {
      var depth, _i, _ref2, _results;
      state.init2();
      _results = [];
      for (depth = _i = 1, _ref2 = maxDepth - state.depth; 1 <= _ref2 ? _i <= _ref2 : _i >= _ref2; depth = 1 <= _ref2 ? ++_i : --_i) {
        phase2(state, depth);
        if (solution !== null) {
          break;
        }
        _results.push(depth++);
      }
      return _results;
    };
    phase2 = function(state, depth) {
      var move, next, _i, _len, _ref2, _results;
      if (depth === 0) {
        if (state.minDist2() === 0) {
          return solution = state.solution();
        }
      } else if (depth > 0) {
        if (state.minDist2() <= depth) {
          _ref2 = state.moves2();
          _results = [];
          for (_i = 0, _len = _ref2.length; _i < _len; _i++) {
            move = _ref2[_i];
            next = state.next2(move);
            phase2(next, depth - 1);
            freeStates.push(next);
            if (solution !== null) {
              break;
            } else {
              _results.push(void 0);
            }
          }
          return _results;
        }
      }
    };
    freeStates = (function() {
      var _i, _ref2, _results;
      _results = [];
      for (x = _i = 0, _ref2 = maxDepth + 1; 0 <= _ref2 ? _i <= _ref2 : _i >= _ref2; x = 0 <= _ref2 ? ++_i : --_i) {
        _results.push(new State);
      }
      return _results;
    })();
    state = freeStates.pop().init(this);
    phase1search(state);
    freeStates.push(state);
    if (solution.length > 0) {
      solution = solution.substring(0, solution.length - 1);
    }
    return solution;
  };

  Cube.scramble = function() {
    return Cube.inverse(Cube.random().solve());
  };

}).call(this);