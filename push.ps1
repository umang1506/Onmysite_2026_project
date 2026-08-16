param (
    [string]$msg = "update code"
)

git add .
git commit -m $msg
git push origin main
