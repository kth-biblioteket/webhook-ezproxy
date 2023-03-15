#!/bin/sh

# variables
LOGFILE=${1}
REPOPATH=${2}
EZPROXYPATH=${3}
CONFIGFILE=${4}
SHIBFILE=${5}

set -e

# Sökväg till EZproxy-tjänsten
cd $EZPROXYPATH

# chmod 755 ezproxy

current_timestamp=$(stat -c %Y ./$CONFIGFILE)

# Sätt root som ägare tillfälligt för att git pull ska fungera
#chown root:root $EZPROXYPATH
#chown root:root $EZPROXYPATH/$CONFIGFILE
#chown root:root $EZPROXYPATH/$SHIBFILE
if ! git pull origin main | grep -q 'Already up to date'; then
        # Uppdaterades config-filen?
        if [ $(stat -c %Y ./$CONFIGFILE) -gt $current_timestamp ]; then
                cp ./$CONFIGFILE $EZPROXYPATH/$CONFIGFILE
                echo "$(date) - $EZPROXYPATH/$CONFIGFILE was updated from repository" >> "./$LOGFILE"
        else
                echo "$(date) - $EZPROXYPATH/$CONFIGFILE was NOT updated from repository" >> "./$LOGFILE"
        fi
fi
# återställ ägarskap
#chown 1000:1000 $EZPROXYPATH
#chown 1000:1000 $EZPROXYPATH/$CONFIGFILE
#chown 1000:1000 $EZPROXYPATH/$SHIBFILE
