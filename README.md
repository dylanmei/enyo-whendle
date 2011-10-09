
Whendle 2 is a clock application for WebOS-based TouchPads

<!--
ssh into emulator:
  => ssh -p 5522 -l root localhost

start the debugger:
  => run-js-service -d /media/cryptofs/apps/usr/palm/services/com.hoopengines.whendle.timekeeping

alarms index
  => luna-send -n 1 palm://com.hoopengines.whendle.timekeeping/list '{}'

alarms post
  => luna-send -n 1 palm://com.hoopengines.whendle.timekeeping/new '{"hour":10,"minute":11,"sunday":true,"on":true}'

alarms delete
  => luna-send -n 1 palm://com.hoopengines.whendle.timekeeping/delete '{"id":"XXXX"}'
-->