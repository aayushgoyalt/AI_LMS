
CC = gcc
JS = bun

all: server

client: src/*
	$(JS) run build --minify terser
	make server

server: server/*
	$(CC) -s -O2 -o ./dist/server server/cli.c -lpthread -lcurl

run: server frontend
	cd dist && ./server


