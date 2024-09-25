git add .
username=$(git config user.name)
date=$(date +"%Y-%m-%d %H:%M:%S")
message="$username at $date"
git commit -m "$message"
git push origin main --set-upstream
echo 'Done!'
