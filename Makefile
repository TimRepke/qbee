PULSE_SERVER=tcp:$(shell hostname -i):4713
PULSE_COOKIE_DATA=$(shell pax11publish -d | grep --color=never -Po '(?<=^Cookie: ).*')

all: config/config.mopidy
	docker-compose build

run: config/config.mopidy
	docker-compose up

config/config.mopidy:
	@echo "PULSE_SERVER=${PULSE_SERVER}\nPULSE_COOKIE_DATA=${PULSE_COOKIE_DATA}" > config/config.mopidy

clean:
	rm -f config/config.mopidy
	docker-compose rm