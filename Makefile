PULSE_SERVER=tcp:$(hostname -i):4713
PULSE_COOKIE_DATA=$(pax11publish -d | grep --color=never -Po '(?<=^Cookie: ).*')

all:
	docker-compose build

run:
	docker-compose up

clean:
	docker-compose rm