def on_a_pressed():
    global projectile
    projectile = sprites.create_projectile_from_sprite(assets.image("""
        bullet
        """), mySprite, 100, 0)
controller.A.on_event(ControllerButtonEvent.PRESSED, on_a_pressed)

def on_on_overlap(sprite2, otherSprite2):
    info.change_life_by(-1)
    sprites.destroy(otherSprite2, effects.disintegrate, 500)
    scene.camera_shake(4, 500)
sprites.on_overlap(SpriteKind.player, SpriteKind.enemy, on_on_overlap)

def on_on_overlap2(sprite, otherSprite):
    sprites.destroy(sprite)
    statusbars.get_status_bar_attached_to(StatusBarKind.health, mySprite).value += 0
    info.change_score_by(1)
sprites.on_overlap(SpriteKind.projectile, SpriteKind.enemy, on_on_overlap2)

statusbar: StatusBarSprite = None
EnemyShip: Sprite = None
projectile: Sprite = None
mySprite: Sprite = None
effects.star_field.start_screen_effect()
mySprite = sprites.create(assets.image("""
        playerSprite
        """),
    SpriteKind.player)
controller.move_sprite(mySprite)
mySprite.set_flag(SpriteFlag.STAY_IN_SCREEN, True)
info.set_life(5)

def on_update_interval():
    global EnemyShip, statusbar
    EnemyShip = sprites.create(assets.image("""
        enemySprite
        """), SpriteKind.enemy)
    EnemyShip.x = scene.screen_width()
    EnemyShip.y = randint(10, scene.screen_height() - 10)
    EnemyShip.vx = -20
    statusbar = statusbars.create(20, 4, StatusBarKind.enemy_health)
    statusbar.attach_to_sprite(EnemyShip)
game.on_update_interval(2000, on_update_interval)
