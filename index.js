const canvas = document.querySelector('canvas')
// initialize canvas context
const c = canvas.getContext('2d')

canvas.width = innerWidth
canvas.height = innerHeight

// check if device is mobile
const isMobile = canvas.width <= 768 ? true : false

// get elements references
const scoreEl = document.querySelector('.score-value')
const livesEl = document.querySelector('.lives-value')
const levelUpTextEl = document.querySelector('.level-up-text')
const levelUpEl = document.querySelector('.level-up')
const activeEffectTextEl = document.querySelector('.active-effect-text')
const activeEffectEl = document.querySelector('.active-effect')
// main modal
const startGameBtn = document.querySelector('.start-game-btn')
const modalEl = document.querySelector('.modal')
const modalScoreEl = document.querySelector('.modal-score-value')
const highscoreEl = document.querySelector('.modal-highscore-value')
// settings modal
const settingsModalEl = document.querySelector('.settings-modal')
const settingsBtn = document.querySelector('.settings-btn')
const resumeBtn = document.querySelector('.resume-btn')
// rules modal
const rulesModalEl = document.querySelector('.rules-modal')
const rulesBackBtn = document.querySelector('.rules-back-btn')
const rulesBtn = document.querySelector('.rules-btn')
// about modal
const aboutBtn = document.querySelector('.about-btn')
const aboutModalEl = document.querySelector('.about-modal')
const aboutBackBtn = document.querySelector('.about-back-btn')
// contact modal
const contactBtn = document.querySelector('.contact-btn')
const contactModalEl = document.querySelector('.contact-modal')
const contactBackBtn = document.querySelector('.contact-back-btn')

class Player {
	constructor(x, y, radius, color) {
		this.x = x
		this.y = y
		this.radius = radius
		this.color = color
	}

	draw() {
		c.beginPath()
		c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false)
		c.fillStyle = this.color
		c.fill()
	}

	// levelUp() {
	// 	if (!levelDisplayed) {
	// 		levelUpEl.innerHTML = `Level ${currentLevel} Reached!`
	// 		levelUpTextEl.classList.add('active')
	// 		levelUpEl.classList.add('active')
	// 		setTimeout(() => {
	// 			levelUpTextEl.classList.remove('active')
	// 			levelUpEl.classList.remove('active')
	// 			levelUpEl.innerHTML = ''
	// 			levelDisplayed = true
	// 		}, 3000)
	// 	}
	// }
}

class Projectile {
	constructor(x, y, radius, color, velocity) {
		this.x = x
		this.y = y
		this.radius = radius
		this.color = color
		this.velocity = velocity
	}
	draw() {
		c.beginPath()
		c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false)
		c.fillStyle = this.color
		c.fill()
	}
	update() {
		this.draw()
		this.x = this.x + this.velocity.x
		this.y = this.y + this.velocity.y
	}
}

class Enemy {
	constructor(x, y, radius, color, velocity) {
		this.x = x
		this.y = y
		this.radius = radius
		this.color = color
		this.velocity = velocity
	}
	draw() {
		c.beginPath()
		c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false)
		c.fillStyle = this.color
		c.fill()
	}
	update() {
		this.draw()
		this.x = this.x + this.velocity.x
		this.y = this.y + this.velocity.y
	}
}
class Bonus {
	constructor(x, y, width, height, color, velocity, name) {
		this.x = x
		this.y = y
		this.width = width
		this.height = height
		this.color = color
		this.velocity = velocity
		this.name = name
	}
	draw() {
		c.beginPath()
		c.rect(this.x, this.y, this.width, this.height)
		c.lineWidth = '1'
		c.strokeStyle = this.color
		c.stroke()
	}
	update() {
		this.draw()
		this.x = this.x + this.velocity.x
		this.y = this.y + this.velocity.y
	}
	activateEffect() {
		if (this.name === 'nuke') {
			c.fillStyle = 'rgba(0,0,0,0.1)'
			c.fillRect(0, 0, canvas.width, canvas.height)
			player.draw()
			projectiles = []
			enemies = []
			particles = []
			bonuses = []
			score += 1000
		}
		if (this.name === 'explosive-rounds') {
			isExplosiveRoundsActivated = true
			setTimeout(() => {
				isExplosiveRoundsActivated = false
			}, 5000)
		}
		if (this.name === 'sharp-shooter') {
			isSharpShooterActivated = true
			setTimeout(() => {
				isSharpShooterActivated = false
			}, 5000)
		}
		if (this.name === 'slow') {
			isSlowActivated = true
			setTimeout(() => {
				isSlowActivated = false
			}, 5000)
		}
		if (this.name === 'extra-life') {
			lives++
			livesEl.innerHTML = lives
		}
		if (this.name === 'end-game') {
			// cancel all animations
			cancelAnimationFrame(animationId)
			clearInterval(spawnEnemiesInterval)
			clearInterval(spawnBonusesInterval)
			window.removeEventListener('click', spawnProjectiles)
			// show modal and update score on UI
			modalEl.style.display = 'flex'
			modalScoreEl.innerHTML = score
		}
		activeEffectEl.innerHTML = `${this.name.toUpperCase()}!`
		activeEffectTextEl.classList.add('active')
		activeEffectEl.classList.add('active')
		activeEffectTextEl.style.left = `${this.x}px`
		activeEffectTextEl.style.top = `${this.y}px`
		setTimeout(() => {
			activeEffectTextEl.classList.remove('active')
			activeEffectEl.classList.remove('active')
			activeEffectEl.innerHTML = ''
		}, 6000)
	}
}

// instantiate friction variable to decrease particle speed
const friction = 0.99

class Particle {
	constructor(x, y, radius, color, velocity) {
		this.x = x
		this.y = y
		this.radius = radius
		this.color = color
		this.velocity = velocity
		this.alpha = 1
	}
	draw() {
		c.save()
		c.globalAlpha = this.alpha
		c.beginPath()
		c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false)
		c.fillStyle = this.color
		c.fill()
		c.restore()
	}
	update() {
		this.draw()
		this.velocity.x *= friction
		this.velocity.y *= friction
		this.x = this.x + this.velocity.x
		this.y = this.y + this.velocity.y
		this.alpha -= 0.01
	}
}

const x = canvas.width / 2
const y = canvas.height / 2

// initialize global variables to reset to when game restarts
let player = new Player(x, y, 20, 'white')
let projectiles = []
let enemies = []
let particles = []
let bonuses = []
let lives = 1
let currentLevel = 1
let isExplosiveRoundsActivated = false
let isSlowActivated = false
let isSharpShooterActivated = false
let levelDisplayed = false

// initialization function to be called when game starts/restarts
const init = () => {
	player = new Player(x, y, 20, 'white')
	projectiles = []
	enemies = []
	particles = []
	bonuses = []
	levelTwo = false
	levelThree = false
	levelFour = false
	levelFive = false
	isExplosiveRoundsActivated = false
	isSlowActivated = false
	isSharpShooterActivated = false
	levelDisplayed = false
	score = 0
	scoreEl.innerHTML = score
	modalScoreEl.innerHTML = score
	lives = 1
	livesEl.innerHTML = lives
}

// determine enemies interval time according to current level
let enemiesIntervalTime =
	currentLevel === 2
		? 900
		: currentLevel === 3
		? 800
		: currentLevel === 4
		? 700
		: currentLevel === 5
		? 600
		: currentLevel === 6
		? 500
		: currentLevel === 7
		? 400
		: currentLevel === 8
		? 350
		: currentLevel === 9
		? 300
		: currentLevel === 10
		? 250
		: 1000
const spawnEnemiesIntervalFunction = () => {
	// randomize between 5-30
	const radius = Math.random() * (30 - 5) + 5
	let x
	let y

	if (Math.random() < 0.5) {
		// spawn enemies from left or right, across the entire screen height
		x = Math.random() < 0.5 ? 0 - radius : canvas.width + radius
		y = Math.random() * canvas.height
	} else {
		// spawn enemies from top or bottom, across the entire screen width
		x = Math.random() * canvas.width
		y = Math.random() < 0.5 ? 0 - radius : canvas.height + radius
	}
	// randomize enemy color
	const color = `hsl(${Math.random() * 360}, 50%, 50%)`

	const angle = Math.atan2(canvas.height / 2 - y, canvas.width / 2 - x)
	let velocity
	if (isSlowActivated) {
		velocity = {
			x: Math.cos(angle) / 2,
			y: Math.sin(angle) / 2,
		}
	} else {
		// determine enemies velocity according to current level
		velocity = {
			x:
				currentLevel === 2
					? Math.cos(angle) * 1.1
					: currentLevel === 3
					? Math.cos(angle) * 1.2
					: currentLevel === 4
					? Math.cos(angle) * 1.3
					: currentLevel === 5
					? Math.cos(angle) * 1.4
					: currentLevel === 6
					? Math.cos(angle) * 1.5
					: currentLevel === 7
					? Math.cos(angle) * 1.6
					: currentLevel === 8
					? Math.cos(angle) * 1.65
					: currentLevel === 9
					? Math.cos(angle) * 1.7
					: currentLevel === 10
					? Math.cos(angle) * 1.75
					: Math.cos(angle),
			y:
				currentLevel === 2
					? Math.sin(angle) * 1.1
					: currentLevel === 3
					? Math.sin(angle) * 1.2
					: currentLevel === 4
					? Math.sin(angle) * 1.3
					: currentLevel === 5
					? Math.sin(angle) * 1.4
					: currentLevel === 6
					? Math.sin(angle) * 1.5
					: currentLevel === 7
					? Math.sin(angle) * 1.6
					: currentLevel === 8
					? Math.sin(angle) * 1.65
					: currentLevel === 9
					? Math.sin(angle) * 1.7
					: currentLevel === 10
					? Math.sin(angle) * 1.75
					: Math.sin(angle),
		}
	}

	enemies.push(new Enemy(x, y, radius, color, velocity))
}

let spawnEnemiesInterval
const spawnEnemies = () => {
	spawnEnemiesInterval = setInterval(
		spawnEnemiesIntervalFunction,
		enemiesIntervalTime
	)
}

const spawnBonusesIntervalFunction = () => {
	// declare all bonuses types
	const bonusTypes = [
		{ name: 'slow', color: 'hsl(170, 50%, 50%)' },
		{ name: 'sharp-shooter', color: 'hsl(220, 50%, 50%)' },
		{ name: 'explosive-rounds', color: 'hsl(10, 50%, 50%)' },
		{ name: 'extra-life', color: 'hsl(120, 50%, 50%)' },
		{ name: 'nuke', color: 'hsl(60, 50%, 50%)' },
		{ name: 'end-game', color: 'hsl(300, 50%, 50%)' },
	]
	let x
	let y
	let isVertical

	if (Math.random() < 0.5) {
		// spawn bonuses from left or right, at start or end of height
		isVertical = false
		x = Math.random() < 0.5 ? 0 - 10 : canvas.width + 10
		y = Math.random() < 0.5 ? 0.2 * canvas.height : 0.8 * canvas.height
	} else {
		// spawn bonuses from top or bottom, at start of width or end of width
		isVertical = true
		x = Math.random() < 0.5 ? 0.2 * canvas.width : 0.8 * canvas.width
		y = Math.random() < 0.5 ? 0 - 10 : canvas.height + 10
	}

	// choose a bonusType at random
	const randomBonus = bonusTypes[Math.floor(Math.random() * 6)]
	const color = randomBonus.color

	let angle

	// check if bonus is coming from top/bottom or left/right
	if (isVertical) {
		// if top, go to bottom. if bottom, go to top
		angle = y < 0 ? Math.PI / 2 : -(Math.PI / 2)
	} else {
		// if left, go right. if right, go left
		angle = x < 0 ? 0 : Math.PI
	}

	const velocity = {
		x: Math.cos(angle),
		y: Math.sin(angle),
	}

	bonuses.push(new Bonus(x, y, 15, 15, color, velocity, randomBonus.name))
}

let spawnBonusesInterval
const spawnBonuses = () => {
	spawnBonusesInterval = setInterval(spawnBonusesIntervalFunction, 10000)
}

let isGamePaused = false
let animationId
let score = 0
// render all canvas objects on the screen
const animate = () => {
	if (!isGamePaused) {
		animationId = requestAnimationFrame(animate)
		c.fillStyle = 'rgba(0,0,0,0.1)'
		c.fillRect(0, 0, canvas.width, canvas.height)
		player.draw()

		// loop over particles
		particles.forEach((particle, index) => {
			// if particle should be removed, remove it, else, keep updating it
			if (particle.alpha <= 0) {
				particles.splice(index, 1)
			} else {
				particle.update()
			}
		})

		// loop over projectiles
		projectiles.forEach((projectile, index) => {
			projectile.update()

			// remove projectiles once they pass the edges of the screen
			if (
				projectile.x + projectile.radius < 0 ||
				projectile.x - projectile.radius > canvas.width ||
				projectile.y + projectile.radius < 0 ||
				projectile.y - projectile.radius > canvas.height
			) {
				setTimeout(() => {
					projectiles.splice(index, 1)
				}, 0)
			}
		})

		// loop over enemies
		enemies.forEach((enemy, index) => {
			enemy.update()

			// measure distance between each enemy and the player
			const dist = Math.hypot(player.x - enemy.x, player.y - enemy.y)

			// enemy hits player - end game - game over
			if (dist - enemy.radius - player.radius < 1) {
				if (lives === 1) {
					// cancel all animations
					cancelAnimationFrame(animationId)
					// show modal and update score on UI
					modalEl.style.display = 'flex'
					modalScoreEl.innerHTML = score
					// get currentHighScore from localStorage
					const currentHighScore = localStorage.getItem('currentHighScore')
					// if it exits:
					if (currentHighScore !== null) {
						// if score > currentHighScore:
						if (score > +currentHighScore) {
							// replace currentHighScore in localStorage with score
							localStorage.setItem('currentHighScore', score)
							// update highscore in UI
							highscoreEl.innerHTML = score
						}
						// else - don't do anything
					} else {
						// else - just save score to localStorage W/O check
						// localStorage.setItem('currentHighScore', score)
					}

					// clear intervals for enemies and bonuses
					clearInterval(spawnEnemiesInterval)
					clearInterval(spawnBonusesInterval)
				} else {
					// lose one life and continue with the game
					lives -= 1
					livesEl.innerHTML = lives
					// remove enemy so it wont keep killing you
					setTimeout(() => {
						enemies.splice(index, 1)
					}, 0)
				}
			}

			// for each enemy, loop over projectiles
			projectiles.forEach((projectile, projectileIndex) => {
				// measure distance between enemy and all projectiles
				const dist = Math.hypot(projectile.x - enemy.x, projectile.y - enemy.y)

				// projectile hits enemy
				if (dist - enemy.radius - projectile.radius < 1) {
					// add particles effect
					for (let i = 0; i < enemy.radius * 2; i++) {
						particles.push(
							new Particle(
								projectile.x,
								projectile.y,
								Math.random() * 2,
								enemy.color,
								{
									x: (Math.random() - 0.5) * (Math.random() * 6),
									y: Math.random() - 0.5 * (Math.random() * 6),
								}
							)
						)
					}

					// determine if enemy should shrink or be destroyed
					if (!isExplosiveRoundsActivated) {
						if (enemy.radius - 10 > 5) {
							// increase score by 100
							score += 100
							scoreEl.innerHTML = score

							// shrink enemy
							gsap.to(enemy, {
								radius: enemy.radius - 10,
							})
							enemy.radius -= 10
							// remove projectile
							setTimeout(() => {
								projectiles.splice(projectileIndex, 1)
							}, 0)
						} else {
							// increase score by 250
							score += 250
							scoreEl.innerHTML = score

							// remove enemy and projectile
							setTimeout(() => {
								enemies.splice(index, 1)
								projectiles.splice(projectileIndex, 1)
							}, 0)
						}
					} else {
						// increase score by 250
						score += 250
						scoreEl.innerHTML = score

						// remove enemy and projectile
						setTimeout(() => {
							enemies.splice(index, 1)
							projectiles.splice(projectileIndex, 1)
						}, 0)
					}
					// check score value and change currentLevel accordingly
					if (score >= 0 && score < 10000) {
						currentLevel = 1
					}
					if (score > 10000 && score < 20000) {
						currentLevel = 2
					}
					if (score > 20000 && score < 30000) {
						currentLevel = 3
					}
					if (score > 30000 && score < 40000) {
						currentLevel = 4
					}
					if (score > 40000 && score < 50000) {
						currentLevel = 5
					}
					if (score > 50000 && score < 60000) {
						currentLevel = 6
					}
					if (score > 60000 && score < 70000) {
						currentLevel = 7
					}
					if (score > 70000 && score < 80000) {
						currentLevel = 8
					}
					if (score > 80000 && score < 90000) {
						currentLevel = 9
					}
					if (score > 90000) {
						currentLevel = 10
					}
				}
			})
		})
		// loop over bonuses
		bonuses.forEach((bonus, index) => {
			bonus.update()

			// for each bonus, loop over projectiles
			projectiles.forEach((projectile, projectileIndex) => {
				// measure distance between bonus and all projectiles
				const dist = Math.hypot(projectile.x - bonus.x, projectile.y - bonus.y)

				// projectile hits bonus
				if (dist - 10 - projectile.radius < 1) {
					// add particles effect
					for (let i = 0; i < 14 * 2; i++) {
						particles.push(
							new Particle(
								projectile.x,
								projectile.y,
								Math.random() * 2,
								bonus.color,
								{
									x: (Math.random() - 0.5) * (Math.random() * 6),
									y: Math.random() - 0.5 * (Math.random() * 6),
								}
							)
						)
					}
					// activate bonus effect
					bonus.activateEffect()

					// remove enemy and projectile
					setTimeout(() => {
						bonuses.splice(index, 1)
						projectiles.splice(projectileIndex, 1)
					}, 0)
				}
			})
		})
	}
}

// spawn projectiles function to be used in event listener
const spawnProjectiles = e => {
	// get angle between click position and player to calculate velocity
	const angle = Math.atan2(
		e.clientY - canvas.height / 2,
		e.clientX - canvas.width / 2
	)
	let velocity
	if (isSharpShooterActivated) {
		velocity = {
			x: Math.cos(angle) * 7,
			y: Math.sin(angle) * 7,
		}
	} else {
		velocity = {
			x: Math.cos(angle) * 5,
			y: Math.sin(angle) * 5,
		}
	}
	// instantiate a new projectile by adding it to the projectiles array
	projectiles.push(
		new Projectile(canvas.width / 2, canvas.height / 2, 5, 'white', velocity)
	)
}

// when restart/start btn is clicked, start game
const handleStartGameBtnClick = () => {
	init()
	animate()
	spawnEnemies()
	spawnBonuses()
	window.addEventListener('click', spawnProjectiles)
	modalEl.style.display = 'none'
	settingsModalEl.style.display = 'none'
}

const handleSettingsBtnClick = () => {
	settingsModalEl.style.display = 'flex'
	isGamePaused = true
	window.removeEventListener('click', spawnProjectiles)
	clearInterval(spawnEnemiesInterval)
	clearInterval(spawnBonusesInterval)
}

const handleResumeBtnClick = () => {
	settingsModalEl.style.display = 'none'
	isGamePaused = false
	window.addEventListener('click', spawnProjectiles)
	animate()
	spawnEnemies()
	spawnBonuses()
}

const handleRulesBtnClick = () => {
	rulesModalEl.style.display = 'flex'
}

const handleRulesBackBtnClick = () => {
	rulesModalEl.style.display = 'none'
}

const handleAboutBtnClick = () => {
	aboutModalEl.style.display = 'flex'
}

const handleAboutBackBtnClick = () => {
	aboutModalEl.style.display = 'none'
}

const handleContactBtnClick = () => {
	contactModalEl.style.display = 'flex'
}

const handleContactBackBtnClick = () => {
	contactModalEl.style.display = 'none'
}
