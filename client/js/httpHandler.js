(function() {

  const serverUrl = 'http://127.0.0.1:3000';

  //
  // TODO: build the swim command fetcher here
  //


  // Build up ajax function with params (type/url/success/failure)
  // GET Request returning the res data (swim instruction)
  const ajaxGetSwimInstruction = () => {

    $.ajax({
      type: 'GET',
      url: serverUrl,
      success: (data) => {
        if (data === "rest") {
          console.log(`Swimmer needs a ${data}`)
        } else {
          console.log(`Swim ${data}!`);
          SwimTeam.move(data);
        }
      },
      failure: () => {console.log(`Swim! Swim!`)}
    });
  }

  // Call GET req every X milliseconds
  setInterval(ajaxGetSwimInstruction, 1000);

  /////////////////////////////////////////////////////////////////////
  // The ajax file uplaoder is provided for your convenience!
  // Note: remember to fix the URL below.
  /////////////////////////////////////////////////////////////////////

  const ajaxFileUplaod = (file) => {
    var formData = new FormData();
    formData.append('file', file);
    $.ajax({
      type: 'POST',
      data: formData,
      url: 'FILL_ME_IN',
      cache: false,
      contentType: false,
      processData: false,
      success: () => {
        // reload the page
        window.location = window.location.href;
      }
    });
  };

  $('form').on('submit', function(e) {
    e.preventDefault();

    var form = $('form .file')[0];
    if (form.files.length === 0) {
      console.log('No file selected!');
      return;
    }

    var file = form.files[0];
    if (file.type !== 'image/jpeg') {
      console.log('Not a jpg file!');
      return;
    }

    ajaxFileUplaod(file);
  });

})();
