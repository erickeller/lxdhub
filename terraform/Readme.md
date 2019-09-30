# deploy lxdhub.xyz on GCP

## Prerequisits

* intall terraform (https://www.terraform.io/downloads.html)
* GCP account / free tier
* json file form a service account with project/owner role (https://cloud.google.com/docs/authentication/getting-started)
  for a start, you can give the "Owner" Role
* select a GCP [zone](https://cloud.google.com/compute/docs/regions-zones/)

## Getting started

export path to GCP credentials

```
export GOOGLE_CLOUD_KEYFILE_JSON=~/Downloads/your-project.json
```

Generate an sshkey pair

```
ssh-keygen -f ~/.ssh/id_rsa_gcp_lxdhub -P "" -b 4096 -t rsa
```

terraform the lxdhub instance

```
terraform init
terraform plan
terraform apply
```
