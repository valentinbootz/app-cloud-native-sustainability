# Cloud-Native Sustainability

This repository includes a [React App](https://reactjs.org) for sustainable cloud-native application design that enables application designers to enrich business process models with additional sustainability-related information.

## Getting Started 

The repository includes docker files and docker compose files to start and deploy the app and the `FlightBooking` web service. In addition, the repository includes a GitHub Action that builds a new docker image on every release and pushes the image to the GitHub package registry. You can start up the app at `http://localhost:3000` and the web service at `http://localhost` from published docker images by using `$ docker compose up` with the `docker-compose.yml` file. The `docker-compose-development.yml` file can be used to test the setup by building the app locally using `$ docker compose -f docker-compose-development.yml up`.

The Flight Booking scenario shows the features of the app and the concepts of sustainable cloud-native application design:

The app includes a business process modeler to model a business process. Select `Upload Model` to upload the `FlightBooking.xml` from the repository or other business process models. Select the model elements for the services to see the properties panel and define service metadata. The versions of the `Flight Search` service are missing in the model from the `FlightBooking.xml` and the `Weather Information` service is not defined optional for the business process.

<img width="1440" alt="Bildschirmfoto 2022-06-30 um 13 22 59" src="https://user-images.githubusercontent.com/97349551/176665467-f4bf52b2-53c7-4c7f-8738-76c338183d06.png">

The `FlightBooking` [Apodini](https://github.com/Apodini/Apodini) web service includes sustainability-related metadata by using the [ApodiniSustainability](https://github.com/Apodini/ApodiniSustainability) package to annotate the web service and export the metadata from the web service. Select `Fetch Metadata` to fetch the metadata of the `FlightBooking` web service implementation from `http://localhost/sustainability`. This includes additional versions of the `Flight Search` service in the model and defines the `Weather Information` service optional for the business process. Select `Download Model` to see the metadata in the xml of the business process model.

<img width="1440" alt="Bildschirmfoto 2022-06-30 um 13 23 21" src="https://user-images.githubusercontent.com/97349551/176665533-3269d814-16a7-476d-9b97-48e184b962ee.png">
