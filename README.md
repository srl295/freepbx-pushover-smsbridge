# freepbx-pushover-smsbridge

A bridge between [FreePBX SMS](https://freepbx.org) and Pushover

## Setup

1. Create a Pushover account
2. Set up the [SMS Webhook](https://wiki.freepbx.org/display/FPG/SMS+Webhook) to be something such as <http://yourhost.example.com:21439> ( see 'port' setting below.) I recommend running this as localhost only. Set the webhook to 'receive'.
3. Create the file `config.json`. ("//" entries are comments.)

```json
{
    "port": 21439,
    "routing": {
        "default": {
            "user": "<pushover user key or group key for default routing>"
        },
        "12125551212": {
            "user": "<pushover user key or group key>"
        },
        "18185551212": {
            "user": "<pushover user key or group key>"
        }
    },
    "PUSHOVER_USER": "<pushover user to be used as a last resort>",
    "PUSHOVER_TOKEN": "…"
}
```

If `PUSHOVER_TOKEN` is not set, they will be pulled from the environment. See [pushover-notifications](https://www.npmjs.com/package/pushover-notifications)

## Routing

Update the 'routing' part of config.json to custom route messages.

## Sample input from Sipstation

```json
{ "to": "18185551212",
  "from": "12125551212",
  "adaptor": "Sipstation",
  "time": "Wed, 31 Dec 1969 18:00:00 -0600",
  "message": "Hello, world!",
  "eventDirection": "in" }
```

## License

[Apache-2.0](./LICENSE)

Note: We can’t be responsible for any results from use or misuse of this alpha level software.
Please check everything carefully and review the code.

## Author

[Steven R. Loomis @srl295](https://github.com/srl295) of [@codehivetx](https://github.com/codehivetx)
