WEBHOOK_URL="https://$ZONE-$PROJECT.cloudfunctions.net/$FUNCTION_NAME/bot"
curl "https://api.telegram.org/bot$BOT_TOKEN/setWebhook?url=$WEBHOOK_URL&secret_token=$SECRET_TOKEN"