
Whendle 2 is a clock application for WebOS-based TouchPads

<!--
ssh into emulator:
  => ssh -p 5522 -l root localhost

start the debugger:
  => run-js-service -d /media/cryptofs/apps/usr/palm/services/com.hoopengines.whendle.timekeeping.service

timekeeping
  => luna-send -n 1 palm://com.hoopengines.whendle.timekeeping.service/now '{}'

alarms index
  => luna-send -n 1 palm://com.hoopengines.whendle.timekeeping.service/list '{}'

alarms post
  => luna-send -n 1 palm://com.hoopengines.whendle.timekeeping.service/new '{"hour":10,"minute":11,"sunday":true,"on":true}'

alarms delete
  => luna-send -n 1 palm://com.hoopengines.whendle.timekeeping.service/delete '{"id":"XXXX"}'

copy files to emulator (in a separate terminal)
  => scp -P 5522 file.mp3 root@localhost:/media/internal
-->