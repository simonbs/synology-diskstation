# synology-diskstation

Node module for turning on and off a Synology DiskStation. Tested with a DS214play but is expected to work with all DiskStations.

## Installation

Install using `npm install --save git+ssh://git@github.com/simonbs/synology-diskstation.git`

## Usage

Create an instance of Synology by passing the IP address and port of your DiskStation as arguments.

```javascript
var synology = new Synology('192.168.1.1', 5000)
```

### Turn on

The DiskStation can be turned on by sending a Wake on Lan request. The MAC address of the DiskStation is required in order to send a WOL request. The MAC address can be found in the [DS finder iOS application](https://itunes.apple.com/us/app/ds-finder/id429865523?mt=8e) and the [DS finder Android application](https://play.google.com/store/apps/details?id=com.synology.DSfinder).

```javascript
synology.wol('00:11:22:AA:BB:CC', function(err) {
  console.log(err)
})
```

### Shutdown

You must be authorized with the DiskStation in order to shut it down. Pass your account name and password as arguments. On a successfull login, you'll obtain a `sid`, which is used to shutdown the DiskStation.
 
```javascript
synology.login('myaccountname', 'mypassword', function(err, sid) {
  if (err) {
    console.log(err)
    return
  }
  synology.shutdown(sid, function(err) {
    console.log(err)
  })
})
```

### Checking if the DiskStation Is On

Invoke the `isOn` function to check if the DiskStation is turned on.

```javascript
synology.isOn(function(err, isOn) {
  console.log(isOn)
})
```
