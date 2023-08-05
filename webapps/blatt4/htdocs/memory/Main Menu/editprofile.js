function getQueryParameter(name) {
  name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
  var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
  var results = regex.exec(window.location.search);
  return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
}


document.addEventListener("DOMContentLoaded", function() {
  var playerId = getQueryParameter('id'); // Reuse your getQueryParameter function

  // Fetch the player's data from the server
  fetch(`../player.php?get_player_data=true&id=${playerId}`)
    .then(response => response.json())
    .then(data => {
      document.getElementById('player-id').value = data.id;
      document.getElementById('player-name').value = data.name;
      document.getElementById('player-email').value = data.email;
      // Password field can be left empty or populated with a placeholder
    });

  // Add an event listener to handle form submission
  document.getElementById('edit-profile-form').addEventListener('submit', function(e) {
    e.preventDefault();

    var id = getQueryParameter('id');
    var name = document.getElementById('player-name').value;
    var email = document.getElementById('player-email').value;
    var password = document.getElementById('player-password').value;
    

    // Make a request to the server to update the profile
    fetch('../player.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: `update_profile=true&id=${id}&name=${name}&email=${email}&password=${password}`
    })    
      .then(response => response.text())
      .then(text => {
        return JSON.parse(text);
      })
      .then(data => {
        if (data.status === 'update_success') {
          alert("Success!");
          var url = '../Main Menu/main_menu.html';
          if (id) {
            url += '?id=' + encodeURIComponent(id);
          }
          if (name) {
            url += '&name=' + encodeURIComponent(name);
          }
          window.location.href = url;
        } else {
          alert("Error!");
        }
      })
      .catch(error => {
        console.error('Error:', error);
      });    
  });
});

document.getElementById('delete-profile-btn').addEventListener('click', function() {
  if (!confirm('Are you sure you want to delete your profile? This cannot be undone!')) {
    return;
  }

  var id = getQueryParameter('id');

  fetch('../player.php?delete_profile=true', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: `id=${id}`
  })
  .then(response => response.json())
  .then(data => {
    if (data.status === 'delete_success') {
      alert("Profile deleted!");
      window.location.href = '../Register & Login/index.html'; 
    } else {
      alert("Error deleting profile!");
    }
  })
  .catch(error => {
    console.error('Error:', error);
  });
});
