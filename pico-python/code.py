import rotaryio
import board

encoders = [
    {
        "reference": "encoder1",
        "instance": rotaryio.IncrementalEncoder(board.GP17, board.GP16),
        "previous": 0
    },
    {
        "reference": "encoder2",
        "instance": rotaryio.IncrementalEncoder(board.GP15, board.GP14),
        "previous": 0
    }
]

while True:
    for enc in encoders:
        curr = enc["instance"].position
        change = curr - enc["previous"]
        if change > 0:
            print(f"{enc['reference']}-inc")
        elif change < 0:
            print(f"{enc['reference']}-dec")
        enc["previous"] = curr
