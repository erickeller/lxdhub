# deploy lxdhub.xyz on GCP

## Prerequisits

* intall terraform (https://www.terraform.io/downloads.html)
* GCP account / free tier
* json file form a service account with project/owner role (https://cloud.google.com/docs/authentication/getting-started)

## Getting started

export path to GCP credentials

```
export GOOGLE_CLOUD_KEYFILE_JSON=~/Downloads/your-project.json
```

terraform the lxdhub instance

```
terraform init
terraform plan
terraform apply
```
