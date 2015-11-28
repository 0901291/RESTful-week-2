<?php 
    require 'vendor/autoload.php';
    $baseURI = "http://docent.cmi.hro.nl/bootb/restdemo/notes/";
    $client = new GuzzleHttp\Client();

    $http;
    if (isset($_GET["request"])) 
    {
        $http = $_GET;
    }
    else if (isset($_POST["request"]))
    {
        $http = $_POST;
    }

    if (isset($http["request"]))
    {
        switch ($http["request"])
        {
            case "getAllNotes":
                getAllNotes($client, $baseURI);
                break;
            case "getNote":
                getNote($client, $baseURI, $http["id"]);
                break;
            case "createNote":
                createNote($client, $baseURI, $http["note"]);
                break;
            case "updateNote":
                updateNote($client, $baseURI, $http["note"]);
                break;
            case "deleteNote":
                deleteNote($client, $baseURI, $http["id"]);
                break;
            default:
                getAllNotes($client, $baseURI);
                break;
        }
    }

    function getAllNotes($client, $url)
    {
        $response = $client->get($url);   
        echo $response->getBody();
    }

    function getNote($client, $url, $id)
    {
        $response = $client->get($url . $id);
        echo $response->getBody();
    }
     
    function createNote($client, $url, $note)
    {
        $response = $client->post($url, ["json" => $note]);
        echo $response->getBody();
    }

    function updateNote($client, $url, $note)
    {
        $response = $client->put($url . $note["id"], ["json" => $note]);
        echo $response->getBody();
    }

    function deleteNote($client, $url, $id) 
    {
        $response = $client->delete($url . $id);
        echo "{}";
    }




