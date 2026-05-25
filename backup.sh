#!/bin/sh
# backup.sh - sauvegarde auth_info/ et data/ dans backups/ (archive tar.gz)
# Usage: sh backup.sh
set -e

BACKUP_DIR=backups
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
mkdir -p "$BACKUP_DIR"

echo "Creating backup..."

tar -czf "$BACKUP_DIR/backup_$TIMESTAMP.tar.gz" auth_info data 2>/dev/null || {
  echo "Warning: some folders may be missing (auth_info or data). Backup still created if any files present."
}

# Keep last 7 backups
if [ -d "$BACKUP_DIR" ]; then
  ls -1t "$BACKUP_DIR" | sed -n '8,$p' | while read -r f; do
    rm -f "$BACKUP_DIR/$f"
  done
fi

echo "Backup created: $BACKUP_DIR/backup_$TIMESTAMP.tar.gz"
