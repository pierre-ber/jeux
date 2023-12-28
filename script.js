"use strict";
class Game {
    constructor() {
        this.gameData;
        this.table;
        this.grid;
        this.priceFieldMinusOne = 1
    }

    fetchGame() {
        let tag = document.querySelector("iframe[src*='static-raetsel.ateleris.com'],[token]");
        let token = tag.src?.split('token=')[1].slice(0, 36) ?? tag.token
        return fetch(`https://api.raetsel.ateleris.com/api/tokens/${token}`)
            .then(res => res.json())
            .then(data => this.gameData = data);
    }

    display() {
        this.table = document.createElement('table');
        this.table.style.position = 'absolute';
        this.table.style.top = '10px';
        this.table.style.right = '10px';
        this.table.style.zIndex = "10000";
        let values = this.gameData.description.prizeFields.map(Object.values);
        for (let i = 0; i < this.grid.length; i++) {
            let tr = document.createElement('tr');
            for (let j = 0; j < this.grid[0].length; j++) {
                let td = document.createElement('td');
                td.innerText = this.grid[i][j];
                td.style.padding = "8px";
                for (let [x, y] of values) {
                    if (i === x - this.priceFieldMinusOne && y - this.priceFieldMinusOne === j) {
                        td.style.backgroundColor = "#0ff"
                    }
                }
                tr.appendChild(td);
            }
            this.table.appendChild(tr);
        }
        document.body.appendChild(this.table);

    }
}

class Sudoku extends Game {
    constructor() {
        super();
        this.grid = Array(9).fill(0).map(_ => Array(9).fill('.'));
    }

    build() {
        this.gameData.description.hints.forEach(hint => {
            this.grid[hint.row - 1][hint.column - 1] = hint.number;
        })
    }

    solve() {
        for (let i = 0; i < 9; i++) {
            for (let j = 0; j < 9; j++) {
                if (this.grid[i][j] == '.') {
                    for (let k = 1; k <= 9; k++) {
                        if (this.isValid(this.grid, i, j, k)) {
                            this.grid[i][j] = k;
                            if (this.solve(this.grid)) {
                                return this.grid;
                            } else {
                                this.grid[i][j] = '.';
                            }
                        }
                    }
                    return null;
                }
            }
        }
        return this.grid;
    }

    isValid(board, row, col, k) {
        for (let i = 0; i < 9; i++) {
            const m = 3 * Math.floor(row / 3) + Math.floor(i / 3);
            const n = 3 * Math.floor(col / 3) + i % 3;
            if (board[row][i] == k || board[i][col] == k || board[m][n] == k) {
                return false;
            }
        }
        return true;
    }

}

class Binoxxo extends Game {
    constructor() {
        super();
        this.grid = Array(10).fill(0).map(_ => Array(10).fill(2));
        this.solved;
    }

    build() {
        let symbol;
        this.gameData.description.hints.forEach(hint => {
            if (hint.symbol == "x")
                symbol = 0;
            else if (hint.symbol == "o")
                symbol = 1;
            this.grid[hint.row - 1][hint.column - 1] = symbol;
        })
    }

    assign(solution) {
        this.grid = JSON.parse(JSON.stringify(solution))
    }

    solve() {
        let M, m, o, c, b, s, z;
        const f = (a, x = 0, y = 0, w = a.length, p, R = a[y]) => (M = z => !a.some((r, y) => /(0|1),\1,\1/.exec(s = r.map((v, x) => (v = z ? v : a[x][y], b -= 1 & v, c -= !v, m |= 2 & v, v), b = c = w / 2)) || b * c < 0 | o[b * c || s] & (o[s] = 1), o = {}))(m = 0) & M(1) && (m ? R && [0, 1].map(n => (p = R[x]) == n | p > 1 && (R[x] = n, f(a, z = (x + 1) % w, y + !z), R[x] = p)) : this.assign(a));
        f(this.grid);
        return this.grid;
    }
}

class Paroli extends Game {
    constructor() {
        super();
        this.grid;
        this.combinations;
        this.priceFieldMinusOne = 0;
    }

    build() {
        this.grid = Array(this.gameData.description.rows).fill(0).map(_ => Array(this.gameData.description.cols).fill(0));
        this.gameData.description.questionFields.forEach(questionField => {
            if (questionField.direction === "RIGHT") {
                for (let i = 0; i < this.gameData.description.wordLength; i++) {
                    this.grid[questionField.row][questionField.col + i] = "_"
                }
            } else {
                for (let i = 0; i < this.gameData.description.wordLength; i++) {
                    this.grid[questionField.row + i][questionField.col] = "_"
                }
            }
        });
        this.gameData.description.hints.forEach(hint => {
            this.grid[hint.row][hint.col] = hint.symbol;
        });


        function* permute(permutation) {
            yield permutation;
            var length = permutation.length,
                c = new Array(length).fill(0),
                i = 1, k, p;

            while (i < length) {
                if (c[i] < i) {
                    k = i % 2 && c[i];
                    p = permutation[i];
                    permutation[i] = permutation[k];
                    permutation[k] = p;
                    ++c[i];
                    i = 1;
                    yield permutation.slice();
                } else {
                    c[i] = 0;
                    ++i;
                }
            }
        }

        this.combinations = permute(this.gameData.description.words);
    }

    solve() {
        const translate = []
        for (let i = 0; i < this.grid.length; i++) {
            if (this.grid[i].filter(x => x === 0).length <= 3) {
                let tmp = [];
                for (let j = 0; j < this.grid[i].length; j++) {
                    if (this.grid[i][j] !== 0) {
                        tmp.push([i, j])
                    }
                }
                translate.push(tmp)
            }
        }
        for (let i = 0; i < this.grid.length; i++) {
            if (this.grid.map((row) => row[i]).filter(x => x === 0).length <= 3) {
                let tmp = [];
                this.grid.forEach((row, j) => {
                    if (row[i] !== 0) {
                        tmp.push([j, i])
                    }
                })
                translate.push(tmp)
            }
        }

        let currentIndex = translate.length, randomIndex;

        while (currentIndex > 0) {
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex--;
            [translate[currentIndex], translate[randomIndex]] = [
                translate[randomIndex], translate[currentIndex]];
        }

        for (let permutation of this.combinations) {
            let gridCopy = JSON.parse(JSON.stringify(this.grid))
            if (insertIntoGrid(gridCopy, permutation, translate)) {
                this.grid = gridCopy;
                return this.grid;
            }
        }

        function insertIntoGrid(_grid, permutation, translate) {
            for (let i = 0; i < permutation.length; i++) {
                if (canPlace(_grid, permutation[i], translate[i])) {
                    place(_grid, permutation[i], translate[i])
                } else
                    return false
            }
            return _grid
        }

        function canPlace(_grid, word, validCells) {
            let iter = 0;
            for (let [x, y] of validCells) {
                if (_grid[x][y] !== "_" && _grid[x][y] !== word[iter]) {
                    return false
                }
                iter++;
            }
            return true;
        }

        function place(_grid, word, validCells) {
            let iter = 0;
            for (let [x, y] of validCells) {
                _grid[x][y] = word[iter]
                iter++;
            }
        }
    }

}

function init() {
    let currentUrl = location.toString()
    let gameName = location.pathname.split('/').pop().slice(0, -5);
    let game;
    switch (gameName) {
        case 'sudoku':
            game = new Sudoku(currentUrl);
            break
        case 'binoxxo':
            game = new Binoxxo(currentUrl);
            break
        case 'paroli':
            game = new Paroli(currentUrl);
            break
        default:
            throw new Error("Unsupported website or game");
    }
    game.fetchGame()
        .then(() => {
            game.build();
            game.solve();
            game.display();
        })
}

init()