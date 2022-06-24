import sys
import websockets
import asyncio
import json

#connects to endpoint ENDPOINT
async def main(data):
    ENDPOINT = 'ws://194.233.73.248:30205/'
    async with websockets.connect(ENDPOINT) as websocket:
        await websocket.send('{"op":"subscribe","exchange":"%s","feed":"%s"}' % (sys.argv[1], sys.argv[2]))
        while True:
            message = await websocket.recv()
            data.append(json.loads(message))

if __name__ == "__main__":
    data = []
    try:
        asyncio.run(main(data))
    except KeyboardInterrupt:
        print("\nExiting and saving to file")
        with open('data.json', 'w') as outfile:
            json.dump(data, outfile)
        sys.exit(0)