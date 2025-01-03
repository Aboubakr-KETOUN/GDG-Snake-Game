let canvas = document.getElementById('gameCanvas');
        let ctx = canvas.getContext('2d');
        let overlay = document.getElementById('overlay');
        let overlayText = document.getElementById('overlayText');
        const startBTN = document.getElementById('startBTN');
        const replayBTN = document.getElementById('replayBTN');
        let scoreDisplay = document.getElementById('score');        

        const Minecraft = new Audio("Minecraft villager sound.mp3");
        const HamHam = new Audio("Ham Ham.m4a");

        const scale = 20;
        canvas.width = 400;
        canvas.height = 400;

        let snake;
        let fruit;
        let gameInterval;

        function Fruit() {
            this.x;
            this.y;

            this.pickLocation = function () {
                this.x = Math.floor(Math.random() * (canvas.width / scale)) * scale;//0-20
                this.y = Math.floor(Math.random() * (canvas.height / scale)) * scale;
            };

            this.draw = function () {
                ctx.fillStyle = "#4cafab";
                ctx.fillRect(this.x, this.y, scale, scale);
            };

        }

        function Snake() {
            this.x = 0;
            this.y = 0;
            this.xSpeed = scale * 1;
            this.ySpeed = 0 ;
            this.total = 0;
            this.tail = [];

            this.draw = function () {
                ctx.fillStyle = "#FFFFFF";

                for (let i = 0; i < this.tail.length; i++) {
                    ctx.fillRect(this.tail[i].x, this.tail[i].y, scale, scale);
                }

                ctx.fillRect(this.x, this.y, scale, scale);
            };

            this.update = function () {
                for (let i = 0; i < this.tail.length - 1; i++) {
                    this.tail[i] = this.tail[i + 1];
                }
                
                this.tail[this.total - 1] = { x: this.x, y: this.y };

                this.x += this.xSpeed;
                this.y += this.ySpeed;
            };

            this.changeDirection = function (direction) {
                switch (direction) {
                    case 'Up':
                        if (this.ySpeed === 0) {
                            this.xSpeed = 0;
                            this.ySpeed = -scale * 1;
                        }
                        break;
                    case 'Down':
                        if (this.ySpeed === 0) {
                            this.xSpeed = 0;
                            this.ySpeed = scale * 1;
                        }
                        break;
                    case 'Left':
                        if (this.xSpeed === 0) {
                            this.xSpeed = -scale * 1;
                            this.ySpeed = 0;
                        }
                        break;
                    case 'Right':
                        if (this.xSpeed === 0) {
                            this.xSpeed = scale * 1;
                            this.ySpeed = 0;
                        }
                        break;
                }
            };

            this.eat = function (fruit) {
                if (this.x === fruit.x && this.y === fruit.y) {
                    this.total++;
                    return true;
                }

                return false;
            };

            this.checkCollision = function () {
                // Wall collision
                if (this.x < 0 || this.x >= canvas.width || this.y < 0 || this.y >= canvas.height) {
                    return true;
                }

                // Self-collision
                for (let i = 0; i < this.tail.length; i++) {
                    if (this.x === this.tail[i].x && this.y === this.tail[i].y) {
                        return true;
                    }
                }
                return false;
            };
        }


        function setup() {
            snake = new Snake();
            fruit = new Fruit();
            fruit.pickLocation();
            updateScore(0);
        }

        function startGame() {
            hideOverlay();
            setup();
            gameInterval = window.setInterval(() => {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                fruit.draw();
                snake.update();
                snake.draw();

                if (snake.eat(fruit)) {
                    HamHam.play();
                    fruit.pickLocation();
                    updateScore(snake.total);
                }

                if (snake.checkCollision()) {
                    endGame();
                }
            }, 100);
        }

        function endGame() {
            clearInterval(gameInterval);
            showOverlay('Game Over!', false);
            Minecraft.play();
        }

        function showOverlay(message, isStart = true) {
            overlayText.textContent = message;
            overlay.classList.add('visible');
            startBTN.style.display = isStart ? 'block' : 'none';

            replayBTN.style.display = isStart ? 'none' : 'block';
            // $("#replayBTN").css("display","none");
            // $("#replayBTN").hide();
        }

        function hideOverlay() {
            overlay.classList.remove('visible');
        }

        function updateScore(score) {
            scoreDisplay.innerText = `Score: ${score}`;
        }

        startBTN.addEventListener('click', () => {
            startGame();
        });

        replayBTN.addEventListener('click', () => {
            startGame();
        });

        window.addEventListener('keydown', (evt) => {
            if (!overlay.classList.contains('visible')) {
                const direction = evt.key.replace('Arrow', '');
                snake.changeDirection(direction);
            }
        });

        showOverlay('Press Start to play the game');