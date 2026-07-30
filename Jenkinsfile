pipeline {
    agent any
    environment {
        IMAGE_NAME = "ai-resume-backend"
        SONAR_HOST_URL = "http://host.docker.internal:9000"
        SONAR_PROJECT_KEY = "ai-resume-checker"
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
        stage('Trivy Scan') {
            steps {
                sh 'trivy image --severity HIGH,CRITICAL --exit-code 0 --format table $IMAGE_NAME | tee trivy-report.txt'
            }
        }
        stage('SonarQube Analysis') {
            steps {
                withCredentials([string(credentialsId: 'sonar-token', variable: 'SONAR_TOKEN')]) {
                    sh '''
                        sonar-scanner \
                          -Dsonar.projectKey=$SONAR_PROJECT_KEY \
                          -Dsonar.sources=backend \
                          -Dsonar.host.url=$SONAR_HOST_URL \
                          -Dsonar.token=$SONAR_TOKEN \
                          -Dsonar.exclusions=**/node_modules/**
                    '''
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