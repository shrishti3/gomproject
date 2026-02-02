# MadMann Dynamics - Go Backend
# NOTE: Build locally with: go build -o server ./cmd/server
# Then Docker will just run the pre-built binary

FROM alpine:latest

RUN apk --no-cache add ca-certificates

WORKDIR /root/

# Expects pre-built server binary in backend/ directory
COPY server ./

EXPOSE 8080

CMD ["./server"]CMD ["./server"]
