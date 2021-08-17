<html>
	<head>		
	</head>
	<body>
		<p>Hello,</p>
        <p>Certains sites webs sont inaccesibles.</p>
        <div style="background-color: #e0e0e0;">
            <div style="padding: 15px">
                <h5>Liste :</h5>
                <ul>
                    @foreach ($unavailable_resources as $resource)
                        <li>{{$resource['resource']->name}}({{$resource['resource']->url}}) : Statut HTTP {{$resource['http_code']}}</li>
                    @endforeach
                </ul>
            </div>
        </div>
        <p>La team TMW</p>
	</body>
</html>