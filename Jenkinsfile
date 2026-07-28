pipeline {
    agent any

    environment {
        IMAGE_NAME = "ai-resume-backend"
    }

    stages {
        stage('Checkout') {
            steps {
                git branch: 'main', url: 'https://github.com/keerthanaravichandran1509-glitch/ai-resume-checker.git'
            }
        }

        stage('Build Docker Image') {
            steps {
                dir('backend') {
                    sh 'docker build -t $IMAGE_NAME .'
                }
            }
        }

        stage('Verify') {
            steps {
                sh 'docker images $IMAGE_NAME'
            }
        }
    }

    post {
        success {
            echo 'Build succeeded!'
        }
        failure {
            echo 'Build failed — check logs above.'
        }
    }
}