import rotaryio
import board
import digitalio

encoders = [
    {
        "reference": "encoder1",
        "instance": rotaryio.IncrementalEncoder(board.GP15, board.GP14),
        "previous": 0
    },
    {
        "reference": "encoder2",
        "instance": rotaryio.IncrementalEncoder(board.GP17, board.GP16),
        "previous": 0
    },
]

buttons = [
    {
        "reference": "up",
        "instance": digitalio.DigitalInOut(board.GP9),
        "previous": 0
    },
    {
        "reference": "right",
        "instance": digitalio.DigitalInOut(board.GP10),
        "previous": 0
    },
    {
        "reference": "down",
        "instance": digitalio.DigitalInOut(board.GP11),
        "previous": 0
    },
    {
        "reference": "left",
        "instance": digitalio.DigitalInOut(board.GP12),
        "previous": 0
    },
    {
        "reference": "centre",
        "instance": digitalio.DigitalInOut(board.GP13),
        "previous": 0
    },
]


led = digitalio.DigitalInOut(board.LED)
led.direction = digitalio.Direction.OUTPUT
led.value = True

for but in buttons:
    but["instance"].switch_to_input(pull=digitalio.Pull.UP)

while True:
    for but in buttons:
        curr = but["instance"].value
        if not curr and but["previous"]:
            print(f"push-{but['reference']}")
        but["previous"] = curr

    for enc in encoders:
        curr = enc["instance"].position
        change = curr - enc["previous"]
        if change > 0:
            print(f"{enc['reference']}-inc")
        elif change < 0:
            print(f"{enc['reference']}-dec")
        enc["previous"] = curr
