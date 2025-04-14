namespace SpriteKind {
    export const PowerUp = SpriteKind.create()
    export const Mode = SpriteKind.create()
}
controller.A.onEvent(ControllerButtonEvent.Pressed, function () {
    projectile = sprites.createProjectileFromSprite(assets.image`bulletSprite`, mySprite, 100, 0)
    music.play(music.melodyPlayable(music.pewPew), music.PlaybackMode.UntilDone)
    if (doublefireMode && doublefireMode.lifespan > 0) {
        projectile.y += -5
        projectile = sprites.createProjectileFromSprite(assets.image`bulletSprite`, mySprite, 100, 0)
        projectile.y += 5
    }
})
sprites.onOverlap(SpriteKind.Player, SpriteKind.PowerUp, function (sprite, otherSprite) {
    doublefireMode = sprites.create(assets.image`doublefireMode`, SpriteKind.Mode)
    doublefireMode.setPosition(10, 18)
    doublefireMode.lifespan = 10000
    sprites.destroy(otherSprite)
})
statusbars.onZero(StatusBarKind.EnemyHealth, function (status) {
    enemyDeath(status.spriteAttachedTo())
})
function enemyDeath (enemy: Sprite) {
    music.play(music.melodyPlayable(music.smallCrash), music.PlaybackMode.UntilDone)
    sprites.destroy(enemy, effects.disintegrate, 500)
    if (Math.percentChance(25)) {
        powerUp = sprites.create(assets.image`powerUp`, SpriteKind.PowerUp)
        powerUp.x = enemy.x
        powerUp.y = enemy.y
    }
}
sprites.onOverlap(SpriteKind.Projectile, SpriteKind.Enemy, function (sprite, otherSprite) {
    sprites.destroy(sprite)
    statusbars.getStatusBarAttachedTo(StatusBarKind.EnemyHealth, otherSprite).value += -20
    info.changeScoreBy(1)
})
sprites.onOverlap(SpriteKind.Player, SpriteKind.Enemy, function (sprite, otherSprite) {
    music.play(music.melodyPlayable(music.bigCrash), music.PlaybackMode.UntilDone)
    info.changeLifeBy(-1)
    scene.cameraShake(4, 500)
    enemyDeath(otherSprite)
})
let statusbar: StatusBarSprite = null
let EnemyShip: Sprite = null
let powerUp: Sprite = null
let doublefireMode: Sprite = null
let projectile: Sprite = null
let mySprite: Sprite = null
effects.starField.startScreenEffect()
mySprite = sprites.create(assets.image`playerSprite`, SpriteKind.Player)
controller.moveSprite(mySprite)
mySprite.setFlag(SpriteFlag.StayInScreen, true)
info.setLife(5)
let enemySpeed = 20
let enemySpawntime = 0
game.onUpdateInterval(5000, function () {
    enemySpeed += 5
    enemySpeed = Math.min(enemySpeed, 50)
    enemySpawntime += 200
    enemySpawntime = Math.max(enemySpawntime, 500)
})
forever(function () {
    EnemyShip = sprites.create(assets.image`enemySprite`, SpriteKind.Enemy)
    EnemyShip.x = scene.screenWidth()
    EnemyShip.y = randint(10, scene.screenHeight() - 10)
    EnemyShip.vx = -20
    statusbar = statusbars.create(15, 2, StatusBarKind.EnemyHealth)
    statusbar.attachToSprite(EnemyShip)
    statusbar.setColor(7, 2)
    pause(enemySpawntime)
})
