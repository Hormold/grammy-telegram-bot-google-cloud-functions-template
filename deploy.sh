# Description: Deploy a function to Google Cloud Functions

gcloud --quiet beta functions deploy $FUNCTION_NAME \
  --gen2 \
  --runtime=nodejs20 \
  --region=$ZONE \
  --timeout=120s \
  --source=. \
  --entry-point=handleTelegramWebhook \
  --trigger-http \
  --allow-unauthenticated \
  --env-vars-file .env.yaml \
  --min-instances 1 \
  --max-instances 3 \
  --project $PROJECT