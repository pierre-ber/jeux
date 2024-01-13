class Paroli {
    constructor() {
        this.grid;
        this.answer;
        this.answerPosition;
    }

    async build() {
        return new Promise(res => res());
    }

    solve() {
        let game;
        eval(`game = ${ww_main.toString().split("var ww_game = ")[1].split("ww_games.push")[0]}`);
        this.answer = game.lsg.definition.word;
        this.grid = game.matrix.map(line => line.replaceAll("n", "_").split(" "));
        game.worddefinition.forEach(({ word, x, y, r }) => {
            if (r === "S") {
                for (let i = 0; i < word.length; i++) {
                    this.grid[y - 1 + i][x - 1] = word[i];
                }
            } else {
                for (let i = 0; i < word.length; i++) {
                    this.grid[y - 1][x - 1 + i] = word[i];
                }
            }
        })
        this.answerPosition = game.lsg.position;
    }

    display() {
        let table = document.createElement('table');
        table.style.position = "absolute";
        table.style.top = "10px";
        table.style.right = "10px";
        for (let row of this.grid) {
            let tr = document.createElement('tr');
            for (let character of row) {
                let td = document.createElement("td");
                td.style.padding = "10px";
                td.style.textAlign = 'center';
                if (character !== "_") {
                    td.style.backgroundColor = "white";
                    td.style.border = "1px solid black";
                    td.textContent = character;
                }
                tr.appendChild(td);
            }
            table.appendChild(tr);
        }
        for (let position of this.answerPosition) {
            table.children[position.y - 1].children[position.x - 1].style.backgroundColor = "#f29400";
        }
        let tr = document.createElement('tr');
        let paddedAnswer = "   " + this.answer + "   "
        for (let character of paddedAnswer) {
            let td = document.createElement("td");
            td.style.padding = "10px";
            td.style.paddingTop = "30px";
            td.style.textAlign = 'center';
            if (character !== " ") {
                td.style.backgroundColor = "#f29400";
                td.style.border = "1px solid black";
            }
            td.innerText = character.toUpperCase();
            tr.appendChild(td);
        }
        table.appendChild(tr);
        document.body.appendChild(table);
    }
}

class MigrosSudoku {
    constructor() {
        this.grid;
        this.answer;
        this.answerPosition;
    }

    async build() {
        return new Promise(res => res());
    }

    solve() {
        let game;
        eval(`game = ${ww_main.toString().split("var ww_game = ")[1].split("ww_games.push")[0]}`);
        this.grid = game.matrix.map(line => line.split(" "));
        this.answerPosition = game.show_Winfields;
        this.answer = this.answerPosition.map(({ x, y }) => this.grid[y - 1][x - 1])
    }

    display() {
        let table = document.createElement('table');
        table.style.position = "absolute";
        table.style.top = "10px";
        table.style.right = "10px";
        this.grid.forEach(row => {
            let tr = document.createElement('tr');
            row.forEach(number => {
                let td = document.createElement('td');
                td.innerText = number;
                td.style.padding = "10px";
                td.style.textAlign = 'center';
                td.style.backgroundColor = "white";
                td.style.border = "1px solid black";
                tr.appendChild(td);
            })
            table.appendChild(tr);
        })
        this.answerPosition.forEach(({ x, y }) => {
            table.children[y - 1].children[x - 1].style.backgroundColor = "#f29400";
        })
        document.body.appendChild(table);
    }
}

class Binoxxo {
    constructor() {
        this.grid = Array(10).fill(0).map(_ => Array(10).fill(2));
        this.solved;
    }

    async fetchGame() {
        let tag = document.querySelector("iframe[src*='static-raetsel.ateleris.com'],[token]");
        let token = tag.src?.split('token=')[1].slice(0, 36) ?? tag.token
        return fetch(`https://api.raetsel.ateleris.com/api/tokens/${token}`)
            .then(res => res.json())
            .then(data => this.gameData = data);
    }

    async build() {
        await this.fetchGame();
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

    formatGridForDisplay() {
        return JSON.parse(JSON.stringify(this.grid.map(row => row.map(cell => cell === 0 ? "x" : "o"))))
    }

    display() {
        this.displayGrid = this.formatGridForDisplay();
        this.table = document.createElement('table');
        this.table.style.position = 'absolute';
        this.table.style.top = '10px';
        this.table.style.right = '10px';
        this.table.style.zIndex = "10000";
        let values = this.gameData.description.prizeFields.map(Object.values);
        for (let i = 0; i < this.displayGrid.length; i++) {
            let tr = document.createElement('tr');
            for (let j = 0; j < this.displayGrid[0].length; j++) {
                let td = document.createElement('td');
                td.innerText = this.displayGrid[i][j];
                td.style.padding = "10px";
                td.style.textAlign = 'center';
                td.style.backgroundColor = "white";
                td.style.border = "1px solid black";
                for (let [x, y] of values) {
                    if (i === x - 1 && y - 1 === j) {
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

class CoopSudoku {
    constructor() {
        this.grid = Array(9).fill(0).map(_ => Array(9).fill('.'));
    }

    async fetchGame() {
        let tag = document.querySelector("iframe[src*='static-raetsel.ateleris.com'],[token]");
        let token = tag.src?.split('token=')[1].slice(0, 36) ?? tag.token
        return fetch(`https://api.raetsel.ateleris.com/api/tokens/${token}`)
            .then(res => res.json())
            .then(data => this.gameData = data);
    }

    async build() {
        await this.fetchGame();
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

    formatGridForDisplay() {
        return JSON.parse(JSON.stringify(this.grid));
    }

    display() {
        this.displayGrid = this.formatGridForDisplay();
        this.table = document.createElement('table');
        this.table.style.position = 'absolute';
        this.table.style.top = '10px';
        this.table.style.right = '10px';
        this.table.style.zIndex = "10000";
        let values = this.gameData.description.prizeFields.map(Object.values);
        for (let i = 0; i < this.displayGrid.length; i++) {
            let tr = document.createElement('tr');
            for (let j = 0; j < this.displayGrid[0].length; j++) {
                let td = document.createElement('td');
                td.innerText = this.displayGrid[i][j];
                td.style.padding = "10px";
                td.style.textAlign = 'center';
                td.style.backgroundColor = "white";
                td.style.border = "1px solid black";
                for (let [x, y] of values) {
                    if (i === x - 1 && y - 1 === j) {
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

function displayGoToGameButton() {
    let btn = document.createElement('button');
    btn.innerText = "Aller au jeu";
    btn.addEventListener('click', () => {
        window.open(document.querySelector('iframe[src*="comhouse"]').src, "_blank");
    })
    btn.style.position = "absolute";
    btn.style.top = '10px';
    btn.style.right = '10px';
    btn.style.zIndex = "10000";
    document.body.append(btn);
}

function init() {
    let currentUrl = location.toString()
    let gameName = location.pathname.split('/').pop().slice(0, -5);
    let game;
    if (currentUrl.includes('migros')) {
        displayGoToGameButton();
        return;
    } else if (currentUrl.includes('coop')) {
        if (gameName == "sudoku") {
            game = new CoopSudoku();
        } else if (gameName == "binoxxo") {
            game = new Binoxxo();
        }
    } else if (currentUrl.includes('comhouse')) {
        if (currentUrl.includes('sudoku')) {
            game = new MigrosSudoku();
        } else if (currentUrl.includes('paroli')) {
            game = new Paroli();
        }
    }
    game.build()
        .then(() => {
            game.solve();
            game.display();
        })
}

init();