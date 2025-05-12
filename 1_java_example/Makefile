# Domyślny cel: symulacja kompilacji i tworzenie pliku .jar
all:
	@echo "Kompilowanie projektu (symulacja)..."
	@mkdir -p target
	# Symulacja kompilacji - tworzenie pustego pliku JAR
	@touch target/app.jar
	@echo "Projekt skompilowany, artefakt w target/app.jar"

# Cel dla testów: symulacja uruchomienia testów i generowanie raportu JUnit
check:
	@echo "Uruchamianie testów (symulacja)..."
	@mkdir -p target/surefire-reports
	@echo "<?xml version=\"1.0\" encoding=\"UTF-8\"?>" > target/surefire-reports/TEST-com.example.DummyTest.xml
	@echo "<testsuite name=\"com.example.DummyTest\" tests=\"1\" skipped=\"0\" failures=\"0\" errors=\"0\" timestamp=\"2023-10-27T10:00:00\" hostname=\"localhost\" time=\"0.001\">" >> target/surefire-reports/TEST-com.example.DummyTest.xml
	@echo "  <properties/>" >> target/surefire-reports/TEST-com.example.DummyTest.xml
	@echo "  <testcase name=\"exampleTest\" classname=\"com.example.DummyTest\" time=\"0.001\"/>" >> target/surefire-reports/TEST-com.example.DummyTest.xml
	@echo "</testsuite>" >> target/surefire-reports/TEST-com.example.DummyTest.xml
	@echo "Testy zakończone, raport JUnit w target/surefire-reports/"

# Cel dla wdrożenia: symulacja publikacji
publish:
	@echo "Publikowanie artefaktu (symulacja)..."
	@echo "Artefakt opublikowany!"