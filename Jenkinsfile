pipeline {
    agent any
    stages {
        stage('Build') { // Przykładowa nazwa etapu, zmień jeśli trzeba
            steps {
                echo "Hello world2" // Dodano krok: wykonanie polecenia 'make all'
                sh 'javac App.java'// Lub po prostu 'make', jeśli 'all' jest domyślnym celem
            }
        }
        stage('Run') {
            steps {
                sh 'java App'
            }
        }

        // ... inne etapy
    }
}