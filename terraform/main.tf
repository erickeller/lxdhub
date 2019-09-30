resource "google_compute_instance" "vm_instance" {
  name         = "lxdhub"
  machine_type = "f1-micro"

  boot_disk {
    initialize_params {
      image = "ubuntu-minimal-1804-lts"
    }
  }

  network_interface {
    network       = "default"
    access_config {
    }
  }
}