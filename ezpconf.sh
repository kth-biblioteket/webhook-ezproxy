#!/bin/sh

# variables
LOGFILE=${1}
EZPROXYPATH=${2}
CONFIGFILE=${3}
SHIBFILE=${4}

set -e

# Sökväg till EZproxy
cd $EZPROXYPATH

chmod 755 ezproxy

current_timestamp=$(stat -c %Y $EZPROXYPATH/$CONFIGFILE)

# Sätt root som ägare tillfälligt för att git pull ska fungera
chown root:root $EZPROXYPATH
chown root:root $EZPROXYPATH/$CONFIGFILE
chown root:root $EZPROXYPATH/$SHIBFILE
if ! git pull origin main | grep -q 'Already up to date'; then
        # Uppdaterades config-filen?
        if [ $(stat -c %Y $EZPROXYPATH/$CONFIGFILE) -gt $current_timestamp ]; then
                echo "$(date) - config.txt was updated from repository" >> "$EZPROXYPATH$LOGFILE"
        else
                echo "$(date) - config.txt was NOT updated from repository" >> "$EZPROXYPATH$LOGFILE"
        fi
fi
# återställ ägarskap
chown 1000:1000 $EZPROXYPATH
chown 1000:1000 $EZPROXYPATH/$CONFIGFILE
chown 1000:1000 $EZPROXYPATH/$SHIBFILE
