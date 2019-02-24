const fetch = require('node-fetch');
const Discord = require('discord.js');
const {elements,ailments,monster_list } = require('../config.json');

module.exports = {
    name: 'info',
    description: 'i give one monster info',
    execute(message, args) {

      function capitalize(string) {

        mots = string.split("-")
        var sortie = ""

        for (var i = 0; i < mots.length; i++) {
          mot = mots[i];
          sortie += mot.charAt(0).toUpperCase() + mot.slice(1) + "-";
        }
        return sortie.slice(0,sortie.length-1)
      }



      const msg = message.content.slice(5,message.length).toLowerCase();
      var monstre = "" //will contain the correct name for the url
      var prettyname = "" //will contain a pretty name for the monster, with capitalized letters
      const monster_name = msg.split(" ");
      for (var i = 0; i < monster_name.length; i++) {
          name_bits = monster_name[i]
          monstre +=  capitalize(name_bits) + "_";
          prettyname +=  capitalize(name_bits) + " ";
      }

        monstre = monstre.slice(0,monstre.length-1)
        prettyname = prettyname.slice(0,prettyname.length-1)
        var wiki = "https://monsterhunter.fandom.com/wiki/" + monstre //The url we are fetching




        function wik(doc){
          //We first create 'weaknesses', the string containing the monster's weaknesses.


          const begin_weak = doc.indexOf('<h3 class="pi-data-label pi-secondary-font">Weakest to');
          const end_weak =  doc.indexOf('<h3 class="pi-data-label pi-secondary-font">Habitats');

          var weaknesses = ``;

          const doc2 = doc.substring(begin_weak,end_weak);
          for (var i=0; i < elements.length; i++){

            if (doc2.includes(elements[i])){
              current_elt = elements[i].replace(/ /g,'_');
              elt = client.emojis.find(emoji => emoji.name === current_elt + "_weakness");
              weaknesses = weaknesses.concat(`${elt}` + ` ` + elements[i] + `\n`)
              }
            }
          if (weaknesses === ``) {
            console.log("Failure.");
            return "Sorry Master, I can't find the meownster ! :crying_cat_face:";
          }


          //Now we create 'ail', the string containing the ailments.

          var ail= "";
          const begin_ailment = doc.indexOf('<h3 class="pi-data-label pi-secondary-font">Ailment');
          const end_ailment = doc.indexOf('<h3 class="pi-data-label pi-secondary-font">Weakest to')
          const docail = doc.substring(begin_ailment,end_ailment)
          for (var i=0; i<ailments.length;i++){
            if (docail.includes(ailments[i])){
              current_ail = ailments[i].replace(/ /g, '_');
              emoj_ail = client.emojis.find(emoji => emoji.name === current_ail + "_ailment");
              ail = ail.concat(emoj_ail + ` ` + ailments[i]+`\n`);
            }
          }
          if (ail === ``){
            ail = `None`
          }

          //We now create the embed.

          const begin_narrow_document= doc.indexOf('<td colspan="2" style="background-color:#3A5766; color:#ffffff; font-weight:bold; font-size:9pt; text-align:center;"><b>Monster Hunter');
          const end_narrow_document =  doc.indexOf('<b>Threat Level');
          var doc_thumb = doc.substring(begin_narrow_document,end_narrow_document);

          while (doc_thumb.includes('begin_narrow_document')){
            var doc_thumb = doc_thumb.substring(begin_narrow_document,end_narrow_document); //contains the thumbnail
          }

          const begin_thumbnail = doc_thumb.indexOf('data-src=')+10;
          const end_thumbnail = doc_thumb.indexOf('  	 width=')-1;
          doc_thumb = doc_thumb.substring(begin_thumbnail,end_thumbnail);

          //Finally, let's add one random note.
          const begin_trivia = doc.indexOf('<h2><span class="mw-headline" id="Notes">Notes</span></h2>');
          var doc_trivia = doc.substring(begin_trivia);
          const end_trivia = doc_trivia.indexOf('</p></div>')-6;
          var doc_trivia = doc_trivia.substring(0,end_trivia);
          const begin_narrow_trivia = doc_trivia.indexOf("<ul>")+4;
          doc_trivia = doc_trivia.substring(begin_narrow_trivia);
          const garbage_tab = doc_trivia.split("<li>");
          const trivia_tab = []
          var incrementer = true

          //We have to deal with lists within lists....

          for (var i = 0; i < garbage_tab.length;i++){
            if (garbage_tab[i].includes("</ul>")){
              incrementer = true;
              trivia_tab[trivia_tab.length-1]+="-"+garbage_tab[i]
            }
            else if (garbage_tab[i].includes("<ul>")){
              incrementer = false;
              trivia_tab.push(garbage_tab[i])
            }
            else {
              if (incrementer){
                trivia_tab.push(garbage_tab[i])
              }
            else {
                trivia_tab[trivia_tab.length-1]+="-"+garbage_tab[i]
              }
            }
          }

          for (var i = 1; i<trivia_tab.length;i++){
            if (trivia_tab[i].length <= 0 || trivia_tab[i].length>=1024){
              trivia_tab.splice(i, 1);
            }
          }
          const trivia = trivia_tab[Math.floor((Math.random())*trivia_tab.length)]



          //now we cleanup the trivia.
          const trivia_bits = trivia.split('href=')
          var final_trivia = trivia_bits[0]
          for (var i = 1; i<trivia_bits.length;i++){
            var ugly_trivia = trivia_bits[i]
            var link = "https://monsterhunter.fandom.com"
            var begin_link = 1
            var end_link = ugly_trivia.indexOf("title")
            const wikilink = ugly_trivia.substring(begin_link,end_link-2).replace(/\(/g, "%28").replace(/\)/g,"%29")
            link += wikilink
            begin_link = ugly_trivia.indexOf(">")+1
            end_link = ugly_trivia.indexOf("<")
            const link_name = ugly_trivia.substring(begin_link,end_link)
            var end_of_trivia = ugly_trivia.substring(ugly_trivia.indexOf("</a>")+4)
            final_trivia += "["+link_name+"]("+link+")"+end_of_trivia

          }

          final_trivia = final_trivia.replace(/<i>/g, "")
            .replace(/<a/g, "")
            .replace(/<\/i>/g, "")
            .replace(/<\/li>/g, '')
            .replace(/<ul>/g, '')
            .replace(/<\/ul>/g,'')

            if (final_trivia.includes("class")){
              final_trivia = ""
            }


          //Now creating the embed message
          var embed = new Discord.RichEmbed()
            .setColor("RANDOM")
            .setTitle("Monster : ".concat(prettyname))
            .setURL(wiki)
            //.setDescription(wiki)
            .addField("Weakness(es) : ", weaknesses, true)
            .addField("Ailment(s) : ",ail, true )
            if (trivia.length > 0 && trivia.length<1024){
              embed.addField("Note :",final_trivia)
            }
            if (doc_thumb.includes(".png")){embed.setThumbnail(doc_thumb);} //If there is a fitting image, then it is the thumbnail

              console.log("Success."); //Let's put in the logs that the request is a success
              return ({embed}) //Let's return the final message
            }
        var a_trouve = false
        //If the monster is in the list
        for (var i=0;i<monster_list.length;i++){
          if (monstre === monster_list[i]){
          fetch(wiki)
              .then(res => res.text())
              .then(body => message.channel.send(wik(body)))
              a_trouve = true
              break;
            }
          }
        //Otherwise we look for the first occurence of the monster in the list
        if (!a_trouve){
          for (var i=0;i<monster_list.length;i++){
            if (monster_list[i].includes(monstre)){
              prettyname=monster_list[i].replace(/_/g," ")
              wiki = "https://monsterhunter.fandom.com/wiki/" + monster_list[i]
              fetch(wiki)
                  .then(res => res.text())
                  .then(body => message.channel.send(wik(body)))
                  a_trouve = true;
                break;
              }
            }
          }
          if (!a_trouve){
            message.channel.send("Sorry Master, I can't find the meownster ! :crying_cat_face:")
          }
        try{console.log(message.guild.name + ` (${message.guild.memberCount} users)` + " -> "+ prettyname + ` (request by ${message.author.username})`);} catch(e) {
        console.log(e.stack);
    } //Nice logs

    }}
