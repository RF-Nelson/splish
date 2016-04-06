//
//  MasterViewController.swift
//  Splish
//
//  Created by Richard Nelson on 4/6/16.
//  Copyright © 2016 Richard Nelson. All rights reserved.
//

import UIKit
import Alamofire
import SwiftyJSON
import PusherSwift

class MasterViewController: UIViewController, UITableViewDataSource, UITableViewDelegate {
    @IBOutlet weak var textView: UITextView!
    @IBOutlet weak var waitingLabel: UILabel!
    @IBOutlet weak var activityIndicator: UIActivityIndicatorView!
    
    @IBOutlet weak var tableView: UITableView!
    var events: [String : JSON] = [:]
    var json: JSON?
    
    let apiEndpoint: String = "https://splish.herokuapp.com/api/events"

    override func viewDidLoad() {
        super.viewDidLoad()
        self.tableView.delegate = self
        self.tableView.dataSource = self
        
        
        Alamofire.request(.GET, apiEndpoint).validate().responseJSON { response in
            switch response.result {
            case .Success:
                if let value = response.result.value {
                    self.json = JSON(value)
                    print("JSON: \(self.json)")
                    self.activityIndicator.stopAnimating()
                    self.waitingLabel.hidden = true
                    self.events = (self.json?.dictionary)!
                    self.tableView.reloadData()
                }
            case .Failure(let error):
                print(error)
            }
        }
    }
    
    
    override func viewWillAppear(animated: Bool) {
        super.viewWillAppear(animated)
    }
    
    func fetchEvents(completion: ([String]) -> Void) {
        Alamofire.request(.GET, apiEndpoint).validate().responseJSON { response in
            switch response.result {
            case .Success:
                if let value = response.result.value {
                    self.json = JSON(value)
                    print("JSON: \(self.json)")
                }
            case .Failure(let error):
                print(error)
                self.activityIndicator.stopAnimating()
                self.waitingLabel.hidden = true
            }
        }
    }
    
    
    func numberOfSectionsInTableView(tableView: UITableView) -> Int {
        return 1
    }
    
    func tableView(tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        return events.count
    }
    
    func tableView(tableView: UITableView, cellForRowAtIndexPath indexPath: NSIndexPath) -> UITableViewCell {
        let cell = tableView.dequeueReusableCellWithIdentifier("Cell", forIndexPath: indexPath)
//        let int = indexPath.row
//        let object = events[int]
//        cell.textLabel!.text = object
        return cell
    }
    
    func tableView(tableView: UITableView, canEditRowAtIndexPath indexPath: NSIndexPath) -> Bool {
        // Return false if you do not want the specified item to be editable.
        return true
    }
}


