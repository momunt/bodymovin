<?php

	$dir = getcwd();
	$files = scandir($dir);
	// print_r($files);

	foreach($files as $directory){
	    if($directory=='.' or $directory=='..' ){
	        // echo 'dot';
	    }else{
	            if(is_dir($directory)){
	                  echo "<a href='$directory'>$directory</a><br />";
	            }
	    }
	} 
?>