/* KNAPPAR   *******************************************************************/




// #purchase
$(document).on('click', ".purchase", function() {
    var item_id = $(this).parent().parent().find(".item_id").html();
    var item = itemList.get_item(item_id);
	 	itemList.set_item_field(item_id, "status",  "finished");
 		itemList.set_item_field(item.id, "update_date", moment().format('YYYY-MM-DD HH:mm:ss'));    
		open_page(current_page);
});

// #put_on_list
$(document).on('click', ".put_on_list", function() {
    var item_id = $(this).parent().parent().find(".item_id").html();
    var item = itemList.get_item(item_id);
	 	itemList.set_item_field(item_id, "status",  "listed");
		$('#search').val(''); 
    open_page(current_page);
});


// #add_to_dish
$(document).on('click', ".add_to_dish", function() {
    var item_id = $(this).parent().parent().find(".item_id").html();
		var item = itemList.get_item(item_id);	 	
		itemList.add_relation(current_item.id, item_id);
		itemList.add_relation(item_id, current_item.id);
    open_page("#single_dish");
});


$("#new .add-button").click(function() {
   id = itemList.add_from_form(current_page+" form");
	console.log(id);
	console.log(current_item);	 	 
	/*if(current_item.id) {
		itemList.add_relation(current_item.id, id);
	}	*/
	awesomplete.list = itemList.get_quicklist();
	//awesomplete2.list = itemList.get_quicklist();
   open_page(previous_page);
});

$("#groceries .add-button").click(function() {
	if($('#search').val() != "") {
			itemList.add_item({title:$('#search').val(), type:'2', icon:'', prio:'1', status:'listed'}); 
			$('#search').val(''); 
	}
	open_page("#groceries");
});

$(".back-button").click(function() { 
		console.log(	 previous_page );
		open_page(previous_page);
});


$(".cancel-button").click(function() { 
    open_page(previous_page);
}); 


$('#groceries input[type=search]').on('search', function () {
     open_page("#groceries");
});



$("#search").keyup(function() { 
	if($("#search").val().length >1)    
		open_page("#groceries");
}); 

$(".delete-button").click(function() {
	id = $(current_page+" form .item-id").val();
    if (confirm('Delete "'+itemList.get_item(id).title+'"?')==true) {
		itemList.remove_item(id);
		itemList.remove_all_relations(id);
		awesomplete.list = itemList.get_quicklist();
		//awesomplete2.list = itemList.get_quicklist();
		open_page(previous_page);
    }
});


$("#export-button").click(function() { 
    
   	var field1 = $("#field1").val().toLowerCase();
    var op1 = $("#op1").val();
    var value1 = $("#value1").val();
    var field2 = $("#field2").val().toLowerCase();
    var op2 = $("#op2").val();
    var value2 = $("#value2").val();
    var items=itemList.get_all();
    
    var items=itemList.get_all();
    if(field1!="") items = items.query(field1, op1, value1);
    if(field2!="") items = items.query(field2, op2, value2);
 
    var items_string = JSON.stringify(items);
    $("#export").html(items_string);
    $(".page").hide();
    $("#export").show();
});

// finish-button
$(".finish-button").click(function() {
        item = itemList.get_item($("#edit-item-form .item-id").val());
        itemList.edit_from_form("#edit-item-form");
        
        if(item.repeat){
            var item_copy = itemList.copy(item.id);
            item_copy["postpone"] = moment().add( item.repeat, 'days').format('YYYY-MM-DD ddd');   
            //itemList.add_item(item_copy);   
        }
        
	    itemList.set_item_field(item.id, "finish_date", moment().format('YYYY-MM-DD HH:mm:ss'));
		 itemList.set_item_field(item.id, "postpone", "")
	    itemList.save();	       
       open_page(previous_page);
        //$("body").scrollTop(scroll_position);
 });
 
 // import-button
$("#import-button").click(function() { 
    var items = JSON.parse($('#import').val());
    if (confirm('Add '+items.length+' items?')==true) {
       	itemList.import_json($('#import').val());     
       	open_page("#task_list");
    }
});

// i settings
$("#prio-decrease-button").click(function() { 
    if (confirm('Decrease prio one step?')==true){
 			prio_decrease();
			alert("Prio was decreased!");
    }
});
 
 
// more-button
$(".more-button").click(function() {	
	$('.more').show();
	$('.more-button').hide();
});
 


// NEW CHILD 
/*$(document).on('click', ".subitem-right", function() {
	id = $(this).parent().find(".item_id").text();
	item = itemList.get_item(id);
	view_new( {title:"", type:"6", parent_id: item.id,  icon:"", prio:"1", category: item.category, postpone: ""});
});*/



$(".pref-button").click(function() { 
	open_page("#menu");
});

$("#task_list input[name='icon']").click(function() { 
	open_page("#task_list");
});


$(".save-button").click(function() {
   itemList.edit_from_form(current_page+" form");
	awesomplete.list = itemList.get_quicklist();
	//awesomplete2.list = itemList.get_quicklist();
   open_page(previous_page);
});

/*$("#show_postponed").change(function() { 
    open_page("#issues");
}); 
*/


// swipe back
$("#single_issue").on('swiperight',  function(){ 
		var parents = itemList.get_parents(current_item.id);
		if(parents !== undefined && parents.length != 0){	
		current_item = itemList.get_parents(current_item.id)[0];
		console.log(current_item);
		open_page("#single_issue");
	}
});


// swipe back
$("#single_issue").on('swipeleft',  function(){ 
		console.log(	 previous_page );
		open_page(previous_page);
});


// swipe back settings
$("#export").on('swiperight',  function(){ 
	open_page("#menu");
});


$(".task-list-button").click(function() { 
	open_page("#task_list");
});


$(".issue-list-button").click(function() { 
	open_page("#issues");
});



// GOTO EDIT  
$(document).on('click', ".task .subitem-left, .issue .subitem-left", function() {
	id = $(this).parent().find(".item_id").text();
	item = itemList.get_item(id);
	
	$("#edit .menu-title").html("Edit: "+item.title);
    fill_form("#edit-item-form", item);
		parents = itemList.get_parents(id);
				$("#edit .parents").html("");
				parents.forEach(function(item) {
				$("#edit .parents").append("<div class='parent_item' data-parent='"+item.id+"'>"+	item.title+" x</div>");
	  } );
    open_page ("#edit");
});


// Remove relation
$(document).on('click', "#edit .parent_item", function() {
	var child_id = parseInt($("#edit .item-id").val());
	var parent_id = $(this).attr("data-parent");
	console.log(parent_id);	
	console.log(child_id);	
	itemList.remove_relation(parent_id, child_id);
	itemList.remove_relation(child_id, parent_id); //för säkerhets skull
	$(this).hide();
});


// EDIT-BUTTON 
$("#edit-button").click(function() { 
	$("#edit .menu-title").html("Edit: "+current_item.title);
    fill_form("#edit-item-form", current_item);
    open_page ("#edit");
});



// GOTO SINGLE ISSUE
$(document).on('click', "#dishes .subitem-center", function() {
	id = $(this).parent().find(".item_id").text();
	current_item = itemList.get_item(id);
	//console.log(id);
	open_page("#single_dish");
	view_single_dish(id);
});


/*// GOTO SINGLE ISSUE PARENT
$(document).on('click', "#task_list .subitem-center", function() {
	id = $(this).parent().find(".item_id").text();	

	if (itemList.get_item(id).parent_id) {//om item har parent
		current_item = itemList.get_item(itemList.get_item(id).parent_id);
		open_page("#single_issue");
	}

	//view_single_issue(id);
});
*/

window.addEventListener("awesomplete-selectcomplete", function(e){
	var child_id = parseInt($("#edit .item-id").val());
	var str = $("#parent").val();
	var pos = str.indexOf("#");
	var parent_id = parseInt(str.substr(pos+1));
	var parent = itemList.get_item(parent_id);

	itemList.add_relation(parent_id, child_id);
	$("#edit .parents").append("<span class='parent_item' data-parent='"+parent.id+"'>"+	parent.title+" x</span>");

}, false);


window.addEventListener("awesomplete-selectcomplete", function(e){
	
	 switch($(e.target)[0].id) 
        {
	         case "parent": //new
							str = $("#parent").val()
							pos = str.indexOf("#");
							id = parseInt(str.substr(pos+1));
							category = itemList.get_item(id).category;								
							$('#new-item-form select[name="category"]').val(category); 						
							$('#edit-item-form input[name="parent_id"]').val(id); 
           break;
            
					case "parent2": //edit             	
							var child_id = parseInt($("#edit .item-id").val());
							var str = $("#parent").val();
							var pos = str.indexOf("#");
							var parent_id = parseInt(str.substr(pos+1));
							var parent = itemList.get_item(parent_id);

							itemList.add_relation(parent_id, child_id);
							$("#edit .parents").append("<span class='parent_item' data-parent='"+parent.id+"'>"+	parent.title+" x</span>");
          break;
         }
	
}, false);


